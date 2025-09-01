import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from "cloudinary-build-url";
import { ApiError } from "./ApiError.js";

const removeCloudinaryFile = async (url, resource_type) => {
  try {
    const getPublicIdFromUrl = extractPublicId(url);
    const response = await cloudinary.uploader.destroy(getPublicIdFromUrl, {
      resource_type: resource_type || "image",
    });

    return response;
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while removing old image from cloudinary"
    );
  }
};

export { removeCloudinaryFile };
