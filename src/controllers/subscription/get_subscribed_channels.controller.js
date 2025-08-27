import mongoose from "mongoose";
import { SubscriptionModel } from "../../models/subscription.model.js";
import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getSubscribedChannels = asyncHandler(async (req, res) => {
  /*
     -> get channel id from request params 
     -> validate 
     -> get subscribed channel from subscription model 
     -> return response with length property
    */

  const { subscriberId } = req.params;

  if (!subscriberId) {
    throw new ApiError(400, "Channel id param is required");
  }

  const channel = await UserModel.findById(subscriberId);

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const subscribed = await SubscriptionModel.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel", // subscribed channel info
        foreignField: "_id",
        as: "channels",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },

    {
      $project: {
        _id: 0,
        channels: 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalSubscribed: subscribed[0]?.channels?.length,
        subscribedChannels: subscribed[0]?.channels,
      },
      "fetched subscribed"
    )
  );
});

export { getSubscribedChannels };
