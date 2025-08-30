import mongoose from "mongoose";
import { SubscriptionModel } from "../../models/subscription.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getSubscribedChannels = asyncHandler(async (req, res) => {
  /*
     -> get channel id from request params 
     -> validate 
     -> get subscribed channel from subscription model 
     -> return response with length property
    */

  const subscriberId = req.user._id;

  const subscribed = await SubscriptionModel.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [
          {
            $project: {
              _id: 0,
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        channel: {
          $first: "$channel",
        },
      },
    },
    {
      $project: { channel: 1 },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, subscribed, "fetched subscribed"));
});

export { getSubscribedChannels };
