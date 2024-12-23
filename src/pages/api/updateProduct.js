import multer from "multer";
import { ObjectId } from "mongodb"; // Import ObjectId
import { connectToDatabase } from "../../lib/mongodb";
import { uploadFileToDrive } from "../../lib/productGoogleDrive";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser
  },
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "files", maxCount: 20 },
    ])(req, res, async (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res
          .status(500)
          .json({ message: "File upload error", error: err });
      }

      const {
        _id,
        specialID,
        type,
        title,
        description,
        details,
        clientDetails,
        category,
      } = req.body;

      // Check for missing required fields
      if (!_id || !specialID || !type || !title) {
        const missingFields = [];
        if (!_id) missingFields.push("_id");
        if (!specialID) missingFields.push("specialID");
        if (!type) missingFields.push("type");
        if (!title) missingFields.push("title");
        return res.status(400).json({
          message: "Missing required fields",
          missingFields,
        });
      }

      try {
        const { db } = await connectToDatabase();
        const body = req.body;

        const queryId = ObjectId.isValid(_id) ? new ObjectId(_id) : _id;

        const existingProduct = await db
          .collection("products")
          .findOne({ _id: queryId, specialID });

        if (!existingProduct) {
          return res.status(404).json({
            message: "Product not found with the given _id and specialID",
          });
        }

        // Handle thumbnail
        let thumbnailLink = existingProduct.thumbnail || null;
        
        
        if (req.files["thumbnail"]) {
          const file = req.files["thumbnail"][0];
          try {
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
        console.log(thumbnailLink);
          } catch (uploadError) {
            console.error("Error uploading thumbnail:", uploadError);
            return res.status(500).json({
              message: "Error occurred during thumbnail upload.",
              error: uploadError,
            });
          }
        } else if (!existingProduct.thumbnail) {
          return res.status(400).json({
            message:
              "Thumbnail is required either as an existing file or a new upload.",
          });
        }

        // Handle additional files
        const additionalFileLinks = existingProduct.additionalFiles || {};
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

        // Safely process subCategories
        const subCategories = [
          req.body.subcategory1,
          req.body.subcategory2,
          req.body.subcategory3,
        ].filter((subcategory) => subcategory && subcategory !== "none");

        // Update product
        const updateData = {
          type,
          title,
          description,
          details,
          thumbnail: thumbnailLink,
          additionalFiles: additionalFileLinks,
          category,
          subCategories,
          clientDetails,
          updatedAt: new Date(),
        };

        await db
          .collection("products")
          .updateOne({ _id: queryId, specialID }, { $set: updateData });

        const updatedProduct = await db
          .collection("products")
          .findOne({ _id: queryId, specialID });

        return res.status(200).json({
          message: "Product updated successfully!",
          document: updatedProduct,
        });
      } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Update failed.", error });
      }
    });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;

