import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getChannelProfile = asyncHandler(async (req, res) => {
  /**
     -> get username from req.body 
     -> aggregate on user model and return:
        - username, fullname, avatar, coverImage, subscribers, subscribeTo, isSubscribed
     */

  const userId = req.user?._id;
  const { username } = req.params;

  /**
    -> match user
    -> get subscribers
    -> get subscribedTo
    -> add new fields for subscriber count and subscriberToCount
    -> get isSubscribed current user 
    -> project only needed fields
    */
  const channelProfileInfo = await UserModel.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribersArray",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedToArray",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribersArray",
        },
        subscribedToCount: {
          $size: "$subscribedToArray",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [userId, "$subscribersArray.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        username: 1,
        fullname: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);

  if (!channelProfileInfo.length) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelProfileInfo[0],
        "User profile fetched successfully"
      )
    );
});

export { getChannelProfile };
