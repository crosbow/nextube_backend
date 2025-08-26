import mongoose from "mongoose";
import { VideoModel } from "../../models/video.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getVideo = asyncHandler(async (req, res) => {
  /*
    -> get video id from req.params.videoId 
    -> find video by that id 
    -> return full video info 
    */

  const { videoId } = req.query;

  const video = await VideoModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "video",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $count: "subscribers",
        },
        likesCount: {
          $count: "likes",
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"));
});

export { getVideo };
