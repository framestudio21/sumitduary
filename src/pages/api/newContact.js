// /api/contact.js
import multer from "multer";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../lib/mongodb";
import { google } from "googleapis";
import { Readable } from "stream";
import sharp from "sharp";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per file
});

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

const auth = new google.auth.GoogleAuth({
    credentials: {
      type: process.env.TYPE || "service_account",
      project_id: process.env.PROJECT_ID || "frame-studio-439515",
      private_key_id:
        process.env.PRIVATE_KEY_ID || "934e617b0a62da986ffaef14d3036fb4b3405fed",
      private_key: (
        process.env.PRIVATE_KEY ||
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC44DQm9SHcMQnk\n1JJAFjoRSwIQV5vD1cCzYF5rotlunfYrVypJCbtf6HddjDiShI280Gq8ItdiuGUF\n1TKVxFS2Ey5HvkylFuZXCwBXiaGi3CmpxC5u0h+WB61SlAJOYp0SwOR9uqD5dUcS\n6fBUguqWsF+hu1XFjj7isl8aH8GyfUeS4w5CA+ipjiV/UcxPvtK5wmqGgHhS3H62\n+Svv0hFNpeAMdh0WiZzN85OjjwFLiZl1MQwRCzc2dDHTk3W3H9Hn1KvKbHOUPtgX\n+oKejzDWiR+uVvDsoUgQ77ubQCnSDD3SDFe1qN+oYODTKOAApX9YTSGFroW5bQkN\n6FFN5oSlAgMBAAECggEAFrfqgL0P36ShEB81J63zjct3YfW6HPsn9oMJp1V4Pbko\nlpPcDOSmw3boMDU6gHrMhh7gduUbLbT2KRzVXgUl2cgKoGNYvNLPFHQ0Iw21MLO4\nZPXINPMaUY/48xRgIizJG5Rbn72u6WjJhp/72g7KcCEVZ2UDecbsoGQF/spXPa0k\n8yxVf62Rxra6lX90zNXfownMnEz7sHX+bc92ZDTU/MCzyv5XShipXiLr3sdn3274\ncMT5H67M2Sv5Fjl/1qsENdT+8WTOuJ7zek5DXBoSbm1BtQU1LEW+osBm38u1Qm0L\n18EubGpzP5KGPSHL9zs0CSDXpZmhC3NRXxGZVwpLQwKBgQDlUKutvpQ56arm5G7l\nKwZr5YXmpem167R8lbK9FvXm+Id9f9OjHCHQxgK1dKppNct31uXOYOMridAlwiOp\nanEYkZN5Ln3icwq0/EwQ/+Kid6l4TUawY/HShIHCXeVaTQA/lf7ojucjm4+SMTVD\nATB7aRZ08HdVCIpNZNa6msoYjwKBgQDOY63wSZzesR9MI6aDYp7syLcphLRSbvxu\nZ3cX1u4GE4TyFEiCUwfEsc2+GnHiZKThVie0vjFn8DHbxthD8SvPtEZ7R1ZtvJdL\nfGMSEjUlSAtXZKh95nHr8OBrkp8zEttRaaaYoYIHAQwu96Y9VS6xb37e20QrtrUH\nRTmw/9NhiwKBgFZ8N1N+1g6Fd0Q/kSdzM6fL19Vma5+F9vspxlCUcUecIhWN+TbC\nLGq901W2W3L0q/lVnjRYzDSmdE9ZSfPiRic6+ECy7R1TwA0EPngG2eXmdY7+rhNm\njlSUTxAMM6z774ULwCjbhIcka2B6mJjdwPg6aRLPgmIap3aK+oVETcY3AoGAUUZP\nqOBUNh3qBUHEwNiFXRlth5wKpquuHIwCChFJinsFT49NPoUT+hFKxCIF1vFrPJGA\n8Vw0eInOGI4lfBvs9M45MzLUhkJOEhvZp7Qj2ZqVXMT21R16nz8sITCMIMC8PUMt\np81yNu/irFw5ys1Qpe8SNxCBt/UrNMG+BkW4KCECgYEA05bzkI+mC86slCUurEeK\n8QNPyqg/PoLQnzeAdVfcrJNCyMrJMiYmogAY81x5HjFDuzXh655uDwfgbP3MV0hQ\noj3Kk8tpZWsY5l1yqNBMLvzGT1mjRyxfGVPhhTtjBvUw4Q+YSNdpYf0BDuGFczGA\nHt0tpsqVjUDc6scQCAVGP8A=\n-----END PRIVATE KEY-----\n"
      ).replace(/\\n/g, "\n"),
      client_email:
        process.env.CLIENT_EMAIL ||
        "frame-studio@frame-studio-439515.iam.gserviceaccount.com",
      client_id: process.env.CLIENT_ID || "112653429135640403083",
      auth_uri:
        process.env.AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
      token_uri: process.env.TOKEN_URI || "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url:
        process.env.AUTH_PROVIDER_X509_CERT_URL ||
        "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        process.env.CLIENT_X509_CERT_URL ||
        "https://www.googleapis.com/robot/v1/metadata/x509/frame-studio%40frame-studio-439515.iam.gserviceaccount.com",
      universe_domain: process.env.UNIVERSE_DOMAIN || "googleapis.com",
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  
  const driveService = google.drive({ version: "v3", auth });

// Helper: Convert image buffer to WebP and compress
const processImageBuffer = async (buffer) => {
    return sharp(buffer)
      .webp({ quality: 80 }) // Convert to WebP with 80% quality
      .toBuffer();
  };
  
  // Helper: Check if file already exists on Google Drive
  const findDuplicateFile = async (fileName, folderId) => {
    const query = `name='${fileName}' and '${folderId}' in parents and trashed=false`;
    const response = await driveService.files.list({ q: query });
    return response.data.files.length > 0 ? response.data.files[0] : null;
  };
  
  // Upload file to Google Drive
  const uploadFileToDrive = async (file, folderId) => {
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.originalname);
    let buffer = file.buffer;
  
    if (isImage) {
      buffer = await processImageBuffer(file.buffer); // Convert and compress
    }
  
    const fileName = file.originalname.replace(/\.(jpg|jpeg|png|gif|svg)$/i, ".webp");
  
    // Check for duplicates
    const duplicateFile = await findDuplicateFile(fileName, folderId);
    if (duplicateFile) {
      const metadataResponse = await driveService.files.get({
        fileId: duplicateFile.id,
        fields: "id, name, webViewLink, webContentLink",
      });
      return metadataResponse.data;
    }
  
    // Upload file
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };
    const media = {
      mimeType: "image/webp",
      body: Readable.from(buffer),
    };
  
    const response = await driveService.files.create({
      resource: fileMetadata,
      media,
      fields: "id, webViewLink, webContentLink, name",
    });
  
    return response.data;
  };
  
  // Main API Handler
  const handler = async (req, res) => {
    if (req.method === "POST") {
      upload.fields([{ name: "referenceImages", maxCount: 5 }])(
        req,
        res,
        async (err) => {
          if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
              return res
                .status(400)
                .json({ message: "File size exceeds the 5MB limit." });
            }
            return res.status(500).json({ message: "File upload error", error: err });
          }
  
          try {
            const { name, email, subject, category, referenceLink, message } =
              req.body;
            if (!name || !email || !subject || !category) {
              return res.status(400).json({ message: "Missing required fields" });
            }
  
            const { db } = await connectToDatabase();
  
            const referenceImagesLinks = {};
            if (req.files && req.files["referenceImages"]) {
              for (const [index, file] of req.files[
                "referenceImages"
              ].entries()) {
                const uploadedFile = await uploadFileToDrive(
                  file,
                  process.env.GOOGLE_DRIVE_CONTACT_FOLDER_ID
                );
                referenceImagesLinks[`file${index + 1}`] = {
                  id: uploadedFile.id,
                  name: uploadedFile.name,
                  webViewLink: uploadedFile.webViewLink,
                  webContentLink: uploadedFile.webContentLink,
                };
              }
            }
  
            const uniqueID = `${category.toUpperCase()}-${Date.now()}`;
  
            const document = {
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
  
            res.status(200).json({
              message: "Upload successful!",
              document: savedDocument,
            });
          } catch (error) {
            res.status(500).json({ message: "Upload failed.", error });
          }
        }
      );
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  };
  
  export default handler;