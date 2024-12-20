// /utils/getDirectDriveLink.js

export default function getDirectDriveLink (fileLink) {
  if (typeof fileLink !== 'string') {
    console.warn("Invalid fileLink provided to getDirectDriveLink:", fileLink);
    return ''; // Return an empty string or a fallback URL if needed
  }
  
  const match = fileLink.match(/\/d\/(.*?)\//);
  return match
    ? `https://drive.google.com/uc?export=view&id=${match[1]}`
    : fileLink;
};

/**
 * Converts a Google Drive file link into a direct view/download link.
 * Handles both "/d/{fileId}/" and "?id={fileId}" formats.
 * 
 * @param {string} fileLink - The Google Drive file link to transform.
 * @param {boolean} isDownload - Whether to generate a download link (default: false).
 * @returns {string} The direct Google Drive link (view or download).
 */
// export default function getDirectDriveLink(fileLink, isDownload = false) {
//   if (typeof fileLink !== 'string') {
//     console.warn("Invalid fileLink provided to getDirectDriveLink:", fileLink);
//     return ''; // Return an empty string or a fallback URL if needed
//   }

//   // Match the "/d/{fileId}/" format
//   const directMatch = fileLink.match(/\/d\/(.*?)\//);

//   // Match the "?id={fileId}" format
//   const idMatch = fileLink.match(/id=([^&]+)/);

//   // Extract fileId and construct the direct link
//   const fileId = directMatch ? directMatch[1] : idMatch ? idMatch[1] : null;

//   if (fileId) {
//     return isDownload
//       ? `https://drive.google.com/uc?id=${fileId}&export=download`
//       : `https://drive.google.com/uc?export=view&id=${fileId}`;
//   }

//   // Return the original link if no valid fileId is found
//   return fileLink;
// }
