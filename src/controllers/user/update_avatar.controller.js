import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { removeCloudinaryFile } from "../../utils/removeCloudinaryFile.js";

const updateAvatar = asyncHandler(async (req, res) => {
  /**
      -> get new avatar file path 
      -> validate file - is empty
      -> store existing file url in a variable (for delete it from cloudinary after set new one)
      -> upload new file on cloudinary and update user with url
      -> remove old file from cloudinary - extract public id from url ( because cloudinary hav'nt any method to delete image using url).
     */

  const localFilePath = req.file?.path; // only comes 1 file

  if (!localFilePath) {
    return res.status(400).json(new ApiError(400, "avatar is required"));
  }
  const oldFileUrl = req.user.avatar; // old file url

  const newAvatar = await uploadOnCloudinary(localFilePath);
  if (!newAvatar) {
    throw new ApiError(500, `Something wend wrong when uploading avatar image`);
  }

  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: newAvatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  await removeCloudinaryFile(oldFileUrl);

  res.status(200).json(new ApiResponse(200, { newUrl: user.avatar }));
});

export { updateAvatar };
