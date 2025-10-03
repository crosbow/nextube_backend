import { TweetModel } from "../../models/tweet.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  /*
    -> get owner id from req.user._id 
    -> get contend from request body and validate
    -> create new tweet 
    -> return response 
    */

  const owner = req.user._id;
  const { contend } = req.body;

  if (!contend.trim()) {
    return res.status(400).json(new ApiError(400, "Contend is required!"));
  }

  const tweet = await TweetModel.create({
    owner,
    contend,
  });

  return res.status(201).json(new ApiResponse(201, tweet, "Tweet created"));
});

export { createTweet };
