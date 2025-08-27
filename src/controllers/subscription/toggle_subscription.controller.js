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

  const channelObjectId = new mongoose.Types.ObjectId(channelId);
  const currUserObjectId = new mongoose.Types.ObjectId(req.user._id);

  if (channelObjectId.equals(currUserObjectId)) {
    throw new ApiError(400, "Cannot perform this operation with your channel");
  }

  if (!channelId) {
    throw new ApiError(400, "ChannelId is required");
  }

  const channel = await UserModel.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const getSubscriptionById = await SubscriptionModel.find({
    subscriber: currUserObjectId,
  });

  let isSubscribed;

  if (getSubscriptionById) {
    isSubscribed = getSubscriptionById.find((subs) => {
      console.log(subs.channel.equals(channelObjectId));
      return channelObjectId.equals(subs.channel);
    });
  }

  // console.log({ getSubscriptionById, isSubscribed });

  let subscribedStatus;
  if (isSubscribed) {
    await SubscriptionModel.deleteOne({ subscriber: isSubscribed._id });
    subscribedStatus = false;
  } else {
    await SubscriptionModel.create({
      subscriber: req.user._id,
      channel: channelId,
    });
    subscribedStatus = true;
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { subscribedStatus }, "Toggled subscription"));
});

export { toggleSubscription };
