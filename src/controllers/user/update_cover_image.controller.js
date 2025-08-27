import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { removeCloudinaryFile } from "../../utils/removeCloudinaryFile.js";

const updateCoverImage = asyncHandler(async (req, res) => {
  /**
      -> get new coverImage file path 
      -> validate file - is empty
      -> store existing file url in a variable (for delete it from cloudinary after set new one)
      -> upload new file on cloudinary and update user with url
      -> remove old file from cloudinary - extract public id from url ( because cloudinary hav'nt any method to delete image using url).
     */

  const localFilePath = req.file?.path; // only comes 1 file

  if (!localFilePath) {
    throw new ApiError(400, "cover image is required");
  }
  const oldFileUrl = req.user.coverImage; // old file url

  let newCoverImage = await uploadOnCloudinary(localFilePath);

  if (!newCoverImage) {
    throw new ApiError(
      500,
      `Something wend wrong while uploading coverImage image`
    );
  }

  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: newCoverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (oldFileUrl) {
    await removeCloudinaryFile(oldFileUrl);
  }

  res.status(200).json(new ApiResponse(200, { newUrl: user.coverImage }));
});

export { updateCoverImage };
