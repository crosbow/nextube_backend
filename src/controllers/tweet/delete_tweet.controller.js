import { TweetModel } from "../../models/tweet.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const deleteTweet = asyncHandler(async (req, res) => {
  /*
    -> get tweet id from request params 
    -> delete tweet 
    -> return response 
    */

  const { tweetId } = req.params;

  const deletedTweet = await TweetModel.findByIdAndDelete(tweetId);

  if (!deletedTweet) {
    throw new ApiError(404, "tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"));
});

export { deleteTweet };
