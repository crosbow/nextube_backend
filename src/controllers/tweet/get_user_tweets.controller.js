import mongoose from "mongoose";
import { TweetModel } from "../../models/tweet.model.js";
import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getUserTweets = asyncHandler(async (req, res) => {
  /*
    -> get user id from req.params 
    -> validate if user exist
    -> get user tweets 
    -> return response 
    */
  const { userId } = req.params;

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new ApiError(400, "User id is required");
  }

  const tweets = await TweetModel.find({
    owner: new mongoose.Types.ObjectId(userId),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Fetched tweets successfully"));
});

export { getUserTweets };
