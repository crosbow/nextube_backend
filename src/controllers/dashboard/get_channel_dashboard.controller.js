import mongoose from "mongoose";
import { UserModel } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getChannelDashboard = asyncHandler(async (req, res) => {
  /* 
    -> get channel id from req.user._id 
    -> aggregate and get total video views, total subscribers, total videos, total likes 
    -> return response 
    */

  const channelId = req.user._id;

  const stats = await UserModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },

    {
      $addFields: {
        totalVideo: {
          $size: "$videos",
        },
        totalVideoViews: {
          $sum: {
            $map: {
              input: "$videos",
              as: "video",
              in: "$$video.views",
            },
          },
        },
        subscribers: {
          $size: "$subscribers",
        },
      },
    },

    {
      $project: {
        _id: 0,
        subscribers: 1,
        totalVideo: 1,
        totalVideoViews: 1,
      },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, stats, "fetched stats"));
});

export { getChannelDashboard };
