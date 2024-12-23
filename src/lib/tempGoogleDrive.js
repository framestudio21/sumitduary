//lib/uploadToGoogleDrive.js

"use server"; // if you are using reactjs remove this line this is for nextjs only
import { google } from "googleapis";
import { Readable } from "stream";
import sharp from "sharp";
import fs from "fs";
import path from "path";

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

// Helper: Convert image to WebP
const convertToWebP = async (filePath) => {
  const dirName = path.dirname(filePath); // Get the directory of the original file
  const baseName = path.basename(filePath, path.extname(filePath)); // Get the base name without extension
  const webpPath = path.join(dirName, `${baseName}.webp`); // Create a new path with .webp extension

  // Ensure the directory exists
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }

  // Convert the file to WebP
  await sharp(filePath).webp().toFile(webpPath);

  return webpPath;
};

// Helper: Check if file already exists on Google Drive
const findDuplicateFile = async (fileName, folderId) => {
  const query = `name='${fileName}' and '${folderId}' in parents and trashed=false`;
  const response = await driveService.files.list({ q: query });
  return response.data.files.length > 0 ? response.data.files[0] : null;
};

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Upload file to Google Drive
const uploadFileToDrive = async (file, folderId) => {
   // Write the file buffer to a temporary file
   const tempFilePath = path.join(
    process.cwd(),
    "temp",
    `${Date.now()}-${file.originalname}`
  );

  // Ensure the temp directory exists
  if (!fs.existsSync(path.dirname(tempFilePath))) {
    fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
  }

  // Save the buffer to a temporary file
  fs.writeFileSync(tempFilePath, file.buffer);


  // Convert to WebP if it's an image
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file.originalname);
  const uploadPath = isImage ? await convertToWebP(tempFilePath) : tempFilePath;
  const fileName = isImage
    ? file.originalname.replace(/\.(jpg|jpeg|png|gif)$/i, ".webp")
    : file.originalname;

  // Check for duplicates
  const duplicateFile = await findDuplicateFile(fileName, folderId);
  if (duplicateFile) {
    console.log("Duplicate file found:", duplicateFile);
     const metadataResponse = await driveService.files.get({
      fileId: duplicateFile.id,
      fields: "id, name, webViewLink, webContentLink",
    });

    // Clean up temp files and folder
    try {
      await delay(500); // Wait for 500ms to ensure the system has released the file handles
      await fs.promises.unlink(tempFilePath);  // Using promises version of unlink
      if (isImage) await fs.promises.unlink(uploadPath);  // Clean up WebP file if converted

      // Check if the temp folder is empty and delete it
      const tempFolder = path.dirname(tempFilePath);
      const filesInFolder = await fs.promises.readdir(tempFolder);  // Use promises version
      if (filesInFolder.length === 0) {
        await fs.promises.rmdir(tempFolder);  // Remove empty folder
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  
      return metadataResponse.data;
    }
  

  // Upload file
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };
  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(uploadPath),
  };
  const response = await driveService.files.create({
    resource: fileMetadata,
    media,
    fields: "id, webViewLink, webContentLink, name",
  });

  console.log("File uploaded successfully:", response.data);

    // Clean up temp files and folder
    try {
      await delay(500); // Wait for 500ms to ensure the system has released the file handles
      await fs.promises.unlink(tempFilePath);  // Using promises version of unlink
      if (isImage) await fs.promises.unlink(uploadPath);  // Clean up WebP file if converted

      // Check if the temp folder is empty and delete it
      const tempFolder = path.dirname(tempFilePath);
      const filesInFolder = await fs.promises.readdir(tempFolder);  // Use promises version
      if (filesInFolder.length === 0) {
        await fs.promises.rmdir(tempFolder);  // Remove empty folder
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
    }

  return response.data;
};

export { uploadFileToDrive };
