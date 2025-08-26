import { SubscriptionModel } from "../../models/subscription.model.js";
import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getChannelSubscribers = asyncHandler(async (req, res) => {
  /*
     -> get channel id from request params 
     -> validate
     -> get subscribers from subscription model 
     -> return response with length property 
    */

  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Channel id param is required");
  }

  const channel = await UserModel.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const subscribers = await SubscriptionModel.aggregate([
    {
      $match: {
        channel: channelId,
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $count: "$subscriber",
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "fetched subscribers"));
});

export { getChannelSubscribers };
