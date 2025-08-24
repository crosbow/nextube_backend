import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from "cloudinary-build-url"; // allow extract image public_id from url
import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

const UpdateFile = async (req, filename) => {
  /**
      -> get new avatar file path 
      -> validate file - is empty
      -> store existing file url in a variable (for delete it from cloudinary after set new one)
      -> upload new file on cloudinary and update user with url
      -> remove old file from cloudinary - extract public id from url ( because cloudinary hav'nt any method to delete image using url).
     */

  const localFilePath = req.file?.path; // only comes 1 file

  if (!localFilePath) {
    throw new ApiError(400, "File is required");
  }

  const oldFileUrl = req.user[filename]; // old file url

  const response = await uploadOnCloudinary(localFilePath);

  if (!response) {
    throw new ApiError(500, `avatar file is required`);
  }

  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        [filename]: response.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  const publicId = extractPublicId(oldFileUrl);

  const deleteImage = await cloudinary.uploader.destroy(publicId);
  // TODO: test all of these -  console.log(deleteImage);

  return user;
};

const updateAvatar = asyncHandler(async (req, res) => {
  const response = await UpdateFile(req, "avatar");

  res.status(200).json(new ApiResponse(200, { newUrl: response.avatar }));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const response = await UpdateFile(req, "coverImage");

  res.status(200).json(new ApiResponse(200, { newUrl: response.coverImage }));
});

export { updateAvatar, updateCoverImage };
