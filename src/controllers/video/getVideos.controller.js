import mongoose from "mongoose";
import { VideoModel } from "../../models/video.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getVideos = asyncHandler(async (req, res) => {
  /* 
   example queries: 
    page = 2
    limit = 5
    query = "developer"
    sortBy = "createdAt"
    sortType = "desc" || "asc" // asc mean small or last comes first(date) and desc mean big come first, recent date first
    userId = "45"
    */
  /**
     -> Get query params from frontend - page, limit, query, sortBy, sortType, userId 
     -> Explore mongoose-aggregate-paginate-v2 and implement aggregation
     -> get 
     */
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "",
    sortType = "",
    userId,
  } = req.query;

  const options = {
    page,
    limit,
    offset: page * limit - limit,
  };

  if (sortBy) {
    options.sort = { [sortBy]: sortType };
  }

  const aggregateVideos = VideoModel.aggregate([
    {
      $match: {
        owner: { $ne: new mongoose.Types.ObjectId(userId) }, // don't send user videos
      },
    },
    {
      $match: {
        title: {
          $regex: query,
          $options: "i",
        },
      },
    },
  ]);

  const videos = await VideoModel.aggregatePaginate(aggregateVideos, options);

  return res
    .status(200)
    .json(new ApiResponse(200, { videos: videos.docs }, "videos fetched"));
});

export { getVideos };
