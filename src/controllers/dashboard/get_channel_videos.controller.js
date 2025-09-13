import mongoose from "mongoose";
import { VideoModel } from "../../models/video.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getChannelVideos = asyncHandler(async (req, res) => {
  /*
    -> get channel id from req.user._id 
    -> get all videos matched by channel id 
    -> return response with projection
    */

  const channelId = req.user._id;

  const videos = await VideoModel.find({
    owner: new mongoose.Types.ObjectId(channelId),
  }).select("-__v");

  return res.status(200).json(new ApiResponse(200, videos, "Fetched videos"));
});

export { getChannelVideos };
