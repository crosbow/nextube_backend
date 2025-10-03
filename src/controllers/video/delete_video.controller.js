import mongoose from "mongoose";
import { CommentModel } from "../../models/comment.model.js";
import { LikeModel } from "../../models/like.model.js";
import { UserModel } from "../../models/user.model.js";
import { VideoModel } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { removeCloudinaryFile } from "../../utils/removeCloudinaryFile.js";

const deleteVideo = asyncHandler(async (req, res) => {
  /**
      -> get video id from request params
      -> get video from db 
      -> remove video watched history from every user
      -> remove video all likes
      -> remove comments 
      -> remove video from DB 
      -> remove thumbnail using its public id  from cloudinary 
      -> then remove video following same steps 
     */

  const { videoId } = req.params;
  if (!videoId) {
    return res.status(400).json(new ApiError(400, "Video id is required"));
  }

  const video = await VideoModel.findById(new mongoose.Types.ObjectId(videoId));

  if (!video) {
    return res.status(400).json(new ApiError(400, "Video not found"));
  }

  const videoObjectId = new mongoose.Types.ObjectId(video._id);
  await UserModel.updateMany(
    {
      watchHistory: videoObjectId,
    },
    { $pull: { watchHistory: videoObjectId } }
  );

  await LikeModel.deleteMany({ video: videoObjectId });
  await CommentModel.deleteMany({
    video: videoObjectId,
  });

  const thumbnail = video.thumbnail;
  const videoUrl = video.videoUrl;
  await VideoModel.findByIdAndDelete(videoObjectId);

  await removeCloudinaryFile(thumbnail);
  await removeCloudinaryFile(videoUrl, "video");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

export { deleteVideo };
