import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError";

// Configuration
cloudinary.config({
  cloud_name: process.evn.CLOUDINARY_CLOUD_NAME,
  api_key: process.evn.CLOUDINARY_API_KEY,
  api_secret: process.evn.CLOUDINARY_API_SECRET,
});

// Main util
const uploadFile = async (localFilePath) => {
  try {
    if (!localFilePath) {
      new ApiError(404, "Local file path not found");
    }

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auth",
    });

    // uploaded file successfully
    console.log("cloudinary file uploaded successfully", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation failed
    return new ApiError(
      500,
      "Cough error while uploading file to Cloudinary:",
      error
    );
  }
};

export { uploadFile };
