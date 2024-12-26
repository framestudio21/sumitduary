//api/uploadProduct

import multer from "multer";
import crypto from "crypto";
import { connectToDatabase } from "../../lib/mongodb";
const { uploadFileToDrive } = require("../../lib/productGoogleDrive");

const storage = multer.memoryStorage();
const upload = multer({ dest: "/tmp" });

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser
  },
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    console.log("Received POST request");
    upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "files", maxCount: 20 },
    ])(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res
          .status(500)
          .json({ message: "File upload error", error: err });
      }
      console.log("Files received:", req.files);
      console.log("Upload API hit.");
      try {
        // Validate required fields
        const { type, title, category } = req.body;
        if (!type || !title || !category) {
          const missingFields = [];
          if (!type) missingFields.push("type");
          if (!title) missingFields.push("title");
          if (!category) missingFields.push("category");
          return res.status(400).json({
            message: "Missing required fields",
            missingFields,
          });
        }

        console.log("try to connect the mongoDB");
        const { db } = await connectToDatabase();
        console.log("Connected to the MongoDB database successfully.");
        const body = req.body;

        let thumbnailLink = null;
        const additionalFileLinks = {};

        if (req.files["thumbnail"]) {
          const file = req.files["thumbnail"][0];
          const uploadedFile = await uploadFileToDrive(
            file,
            process.env.GOOGLE_DRIVE_FOLDER_ID
          );
          if (!uploadedFile.webViewLink || !uploadedFile.webContentLink) {
            return res.status(500).json({
              message: "Failed to upload thumbnail to Google Drive.",
            });
          }
          thumbnailLink = {
            id: uploadedFile.id,
            name: uploadedFile.name,
            webViewLink: uploadedFile.webViewLink,
            webContentLink: uploadedFile.webContentLink,
          };
        } else {
          return res.status(400).json({
            message: "Thumbnail is required.",
          });
        }

        if (req.files["files"]) {
          for (const [index, file] of req.files["files"].entries()) {
            const uploadedFile = await uploadFileToDrive(
              file,
              process.env.GOOGLE_DRIVE_FOLDER_ID
            );
            if (!uploadedFile.webViewLink || !uploadedFile.webContentLink) {
              return res.status(500).json({
                message: `Failed to upload file ${file.originalname} to Google Drive.`,
              });
            }
            additionalFileLinks[`file${index + 1}`] = {
              id: uploadedFile.id,
              name: uploadedFile.name,
              webViewLink: uploadedFile.webViewLink,
              webContentLink: uploadedFile.webContentLink,
            };
          }
        }

        // Generate a 32-bit hex random specialID code
        const specialID = crypto.randomBytes(16).toString("hex").toUpperCase();

        // Generate a uniqueID code
        const date = new Date();
        const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
        const formattedTime = `${date
          .getHours()
          .toString()
          .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${
          date.getHours() >= 12 ? "PM" : "AM"
        }`;
        const lastUpload = await db
          .collection("products")
          .find({
            // type, category
          })
          .sort({ createdAt: -1 })
          .limit(1)
          .toArray();
        const lastNumber = lastUpload.length
          ? parseInt(lastUpload[0].uniqueID.slice(-3))
          : 0;
        const uploadNumber = (lastNumber + 1).toString().padStart(3, "0");
        const typePrefix = type.substring(0, 2).toUpperCase();
        const uniqueID = `${type.toUpperCase()}${formattedDate}${formattedTime}${category.toUpperCase()}${typePrefix.toUpperCase()}${uploadNumber}`;

        const document = {
          specialID,
          uniqueID,
          type,
          title,
          description: req.body.description || "",
          details: req.body.details || "",
          thumbnail: thumbnailLink,
          additionalFiles: additionalFileLinks,
          category,
          subCategories: [
            req.body.subcategory1,
            req.body.subcategory2,
            req.body.subcategory3,
          ].filter(Boolean), // Exclude empty subcategories
        // ].filter(subcategory => subcategory && subcategory.toLowerCase() !== "none"),
          clientDetails: req.body.clientdetails || "",
          owner: "sumit kumar duary",
          createdAt: new Date(),
        };

        const result = await db.collection("products").insertOne(document);

        // Retrieve the inserted document including MongoDB _id
        const savedDocument = await db
          .collection("products")
          .findOne({ _id: result.insertedId });

        res
          .status(200)
          .json({ message: "Upload successful!", document: savedDocument });
      } catch (error) {
        console.error("Error during upload:", error);
        res.status(500).json({ message: "Upload failed.", error });
      }
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
