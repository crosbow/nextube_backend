import { VideoModel } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { removeCloudinaryFile } from "../../utils/removeCloudinaryFile.js";

const updateVideo = asyncHandler(async (req, res) => {
  /**
      -> get data frontend to update - title, description, thumbnail
      -> check which one is to update 
      -> if thumbnail is to update then update it and validate - remove old image from cloudinary
      -> update video in DB 
      -> return response 
     */

  const { title, description } = req.body;

  const updatableFields = {};

  if (title.trim()) {
    updatableFields.title = title;
  }

  if (description.trim()) {
    updatableFields.description = description;
  }

  const newThumbnailLocalPath = req.file?.path;

  if (!title || !description || !newThumbnailLocalPath) {
    throw new ApiError(400, "At least one field required");
  }

  if (newThumbnailLocalPath) {
    updatableFields.thumbnail = null;
  }

  const thumbnail = await uploadOnCloudinary(newThumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(500, "Something wend wrong when updating thumbnail.");
  }

  updatableFields.thumbnail = thumbnail.url;

  const oldImageInstance = req.user.thumbnail;

  const updateVideoResponse = await VideoModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        ...updatableFields,
      },
    },
    { new: true }
  );

  // delete old image from cloudinary after upload new one
  await removeCloudinaryFile(oldImageInstance);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedVideo: updateVideoResponse },
        "Video updated successfully"
      )
    );
});

export { updateVideo };
