import mongoose from "mongoose";
import { UserModel } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getUserHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  /**
     -> match user
     -> lookup to videos with via watch history 
     -> lookup sub pipeline and get video author info with owner id
     -> project or filter owner info 
     -> project document and get only - url, thumbnail, duration, title, avatar, author fullname
     */
  const histories = await UserModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "authorInfo",
              pipeline: [
                {
                  $project: {
                    avatar: 1,
                    username: 1,
                    fullname: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              authorInfo: {
                $first: "$authorInfo",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, histories[0].watchHistory, "fetched watch history")
    );
});

export { getUserHistory };
