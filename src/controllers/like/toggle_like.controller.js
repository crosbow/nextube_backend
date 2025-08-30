import mongoose from "mongoose";
import { LikeModel } from "../../models/like.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const toggleLike = asyncHandler(async (req, res) => {
  /*
    -> get like type (video or tweet or comment) from request body 
    -> and get likedContent to toggle (video tweet, comment )
    -> validation
    -> Toggle: if already like -> remove like. If not liked -> remove like 
    -> return response
    */

  const { likeType, likedContent } = req.body;

  if (!likeType.trim() && !likedContent.trim()) {
    throw new ApiError(400, "All field is required");
  }

  let result;

  switch (likeType) {
    case "comment":
      const alreadyLikedOnComment = await LikeModel.findOne({
        likeBy: new mongoose.Types.ObjectId(req.user._id),
        comment: new mongoose.Types.ObjectId(likedContent),
      });

      if (!alreadyLikedOnComment) {
        result = await LikeModel.create({
          likeBy: req.user._id,
          comment: likedContent,
        });
      } else {
        result = await LikeModel.deleteOne({
          likeBy: new mongoose.Types.ObjectId(req.user._id),
          comment: new mongoose.Types.ObjectId(likedContent),
        });
      }
      break;
    case "video":
      const alreadyLikedOnVideo = await LikeModel.findOne({
        likeBy: new mongoose.Types.ObjectId(req.user._id),
        video: new mongoose.Types.ObjectId(likedContent),
      });

      if (!alreadyLikedOnVideo) {
        result = await LikeModel.create({
          likeBy: req.user._id,
          video: likedContent,
        });
      } else {
        result = await LikeModel.deleteOne({
          likeBy: new mongoose.Types.ObjectId(req.user._id),
          video: new mongoose.Types.ObjectId(likedContent),
        });
      }
      break;
    case "tweet":
      const alreadyLikedOnTweet = await LikeModel.findOne({
        likeBy: new mongoose.Types.ObjectId(req.user._id),
        tweet: new mongoose.Types.ObjectId(likedContent),
      });

      if (!alreadyLikedOnTweet) {
        result = await LikeModel.create({
          likeBy: req.user._id,
          tweet: likedContent,
        });
      } else {
        result = await LikeModel.deleteOne({
          likeBy: new mongoose.Types.ObjectId(req.user._id),
          tweet: new mongoose.Types.ObjectId(likedContent),
        });
      }
      break;

    default:
      throw new ApiError(404, "Operation does not exist!");
      break;
  }

  return res.status(200).json(new ApiResponse(200, result, "Toggled like"));
});

export { toggleLike };
