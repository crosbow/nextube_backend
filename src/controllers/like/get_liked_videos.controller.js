import mongoose from "mongoose";
import { LikeModel } from "../../models/like.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getLikedVideos = asyncHandler(async (req, res) => {
  /*
    -> initialize userId as req.user._id 
    -> get and aggregate 
    -> return response with videos info
    */

  const userId = req.user._id;

  const likedVideos = await LikeModel.aggregate([
    {
      $match: {
        likeBy: new mongoose.Types.ObjectId(userId),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $project: {
              videoUrl: 1,
              thumbnail: 1,
              owner: 1,
              subscribers: 1,
              title: 1,
              description: 1,
              duration: 1,
              views: 1,
              isPublished: 1,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
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
                    subscribers: {
                      $size: "$subscribers",
                    },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    avatar: 1,
                    fullname: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        video: {
          $first: "$video",
        },
      },
    },
    {
      $project: {
        video: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "fetched liked videos"));
});

export { getLikedVideos };
