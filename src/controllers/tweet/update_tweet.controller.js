import mongoose from "mongoose";
import { TweetModel } from "../../models/tweet.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const updateTweet = asyncHandler(async (req, res) => {
  /*
    -> get tweet id by request params 
    -> get new contend from request body - validate
    -> update tweet with new tweet contend 
    -> validate
    -> return response 
    */
  const { tweetId } = req.params;
  const { newContend } = req.body;

  if (!newContend.trim()) {
    return res
      .status(404)
      .json(new ApiError(404, "new contend should not be empty"));
  }

  const updatedTweet = await TweetModel.updateOne(
    { _id: new mongoose.Types.ObjectId(tweetId) },
    {
      $set: {
        contend: newContend,
      },
    }
  );

  if (!updatedTweet?.modifiedCount) {
    return res.status(404).json(new ApiError(404, "Invalid tweet id"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated"));
});

export { updateTweet };
