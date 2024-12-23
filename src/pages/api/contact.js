import multer from "multer";
import crypto from "crypto";
import { ObjectId } from "mongodb"; // Required for MongoDB _id operations


import { connectToDatabase } from "../../lib/mongodb";
const { uploadFileToDrive } = require("../../lib/contactGoogleDrive");

const storage = multer.memoryStorage();
const upload = multer({ storage });



export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

const handler = async (req, res) => {
  console.log("[1] Received request: ", req.method);

  if (req.method === "POST") {
    upload.fields([{ name: "referenceImages", maxCount: 5 }])(
      req,
      res,
      async (err) => {
        if (err) {
          console.error("[1] Multer error:", err);
          return res
            .status(500)
            .json({ message: "File upload error", error: err });
        }

        try {
          const { name, email, subject, category, referenceLink, message } =
            req.body;
          if (!name || !email || !subject || !category) {
            return res.status(400).json({ message: "Missing required fields" });
          }

          const { db } = await connectToDatabase();
          console.log("[1] Connected to MongoDB");

          const referenceImagesLinks = {};

          if (req.files && req.files["referenceImages"]) {
            for (const [index, file] of req.files[
              "referenceImages"
            ].entries()) {
              const uploadedFile = await uploadFileToDrive(
                file,
                process.env.GOOGLE_DRIVE_CONTACT_FOLDER_ID
              );
              if (!uploadedFile.webViewLink || !uploadedFile.webContentLink) {
                return res.status(500).json({
                  message: `Failed to upload file ${file.originalname} to Google Drive.`,
                });
              }
              referenceImagesLinks[`file${index + 1}`] = {
                id: uploadedFile.id,
                name: uploadedFile.name,
                webViewLink: uploadedFile.webViewLink,
                webContentLink: uploadedFile.webContentLink,
              };
            }
          }

          const specialID = crypto
            .randomBytes(16)
            .toString("hex")
            .toUpperCase();
          const date = new Date();
          const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
          const formattedTime = `${date
            .getHours()
            .toString()
            .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}`;
          const uploadNumber = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0");

          const uniqueID = `CONTACT-${category.toUpperCase()}${formattedDate}${formattedTime}${uploadNumber}`;

          const document = {
            specialID,
            uniqueID,
            name,
            email,
            subject,
            category,
            referenceLink,
            message,
            referenceImages: referenceImagesLinks,
            status: "incomplete",
            createdAt: new Date(),
          };

          const result = await db.collection("contacts").insertOne(document);

          const savedDocument = await db
            .collection("contacts")
            .findOne({ _id: result.insertedId });

          res
            .status(200)
            .json({ message: "Upload successful!", document: savedDocument });
        } catch (error) {
          console.error("[1] Error during upload:", error);
          res.status(500).json({ message: "Upload failed.", error });
        }
      }
    );
  } else if (req.method === "GET") {
    try {
      const { db } = await connectToDatabase();
      console.log("[1] Fetching data from 'contacts' collection");

      const data = await db.collection("contacts").find({}).toArray();
      console.log("[1] Fetched data:", data);

      if (!data || data.length === 0) {
        return res
          .status(404)
          .json({ message: "No data found in contacts collection" });
      }

      res.status(200).json({ message: "Data fetched successfully", data });
    } catch (error) {
      console.error("[1] Error fetching data:", error);
      res.status(500).json({ message: "Failed to fetch data", error });
    }
  } else if (req.method === "PUT") {
    try {
      let body = "";
      await new Promise((resolve, reject) => {
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", resolve);
        req.on("error", reject);
      });
  
      const { _id, status } = JSON.parse(body); // Manually parse the body
  
      if (!_id || !status) {
        return res.status(400).json({ message: "Missing _id or status" });
      }
  
      const { db } = await connectToDatabase();
      const result = await db.collection("contacts").updateOne(
        { _id: new ObjectId(_id) },
        { $set: { status, statusTimestamp: new Date() } }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Document not found" });
      }
  
      res.status(200).json({ message: "Status updated successfully" });
    } catch (error) {
      console.error("[1] Error updating document:", error);
      res.status(500).json({ message: "Failed to update status", error });
    }
  } else if (req.method === "DELETE") {
    try {
      const { db } = await connectToDatabase();
      console.log("[1] Connected to MongoDB");

      // Manually parse the request body
      let body = "";
      await new Promise((resolve, reject) => {
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          resolve();
        });
        req.on("error", (err) => {
          reject(err);
        });
      });

      const { _id } = JSON.parse(body); // Parse the body manually
      console.log("[1] Parsed _id:", _id);

      if (!_id) {
        return res.status(400).json({ message: "Missing _id" });
      }

      const result = await db.collection("contacts").deleteOne({
        _id: new ObjectId(_id),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("[1] Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
