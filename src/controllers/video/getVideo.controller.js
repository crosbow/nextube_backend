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
          $size: "$subscribers",
        },
        likesCount: {
          $size: "$likes",
        },
      },
    },
    {
      $project: {
        likesCount: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        subscribersCount: 1,
        comments: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!video[0]?.isPublished) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "This video is privet"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "video fetched successfully"));
});

export { getVideo };
