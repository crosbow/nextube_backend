import mongoose from "mongoose";
import { SubscriptionModel } from "../../models/subscription.model.js";
import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  /*
     -> Get channel id from request params  
     -> find channel and and validate 
     -> check if already subscribed, 
        > if yes, remove subscription doc from DB 
        > if no, create new subscription 
     -> return toggle subscribe response
    */

  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "ChannelId is required");
  }

  const channel = await UserModel.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const isSubscribed = await SubscriptionModel.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $addFields: {
        isSubscribed: {
          $cond: {
            if: [channelId, "$channel"],
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  let subscribedStatus = isSubscribed[0]?.isSubscribed;

  if (isSubscribed[0]?.isSubscribed) {
    await SubscriptionModel.deleteOne({ subscriber: req.user._id });
    subscribedStatus = false;
  } else {
    await SubscriptionModel.create({
      subscriber: req.user._id,
      channel: channelId,
    });
    subscribedStatus = true;
  }

  return res.status.json(
    new ApiResponse(200, { subscribedStatus }, "Toggled subscription")
  );
});

export { toggleSubscription };
