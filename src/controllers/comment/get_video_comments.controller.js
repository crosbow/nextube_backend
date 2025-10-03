import mongoose from "mongoose";
import { CommentModel } from "../../models/comment.model.js";
import { VideoModel } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getVideoComment = asyncHandler(async (req, res) => {
  /*
      -> Get videoId from params 
      -> check if empty 
      -> get current page and limit number from query params 
      -> get comments using mongoose-aggregate-paginate-v2 way
      -> return response 
    */

  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    return res.status(400).json(new ApiError(400, "video param is required"));
  }

  const isVideoExist = await VideoModel.findById(videoId);

  if (!isVideoExist) {
    return res.status(404).json(new ApiError(404, "Video not found"));
  }

  const options = {
    page,
    limit,
    offset: page * limit - limit,
  };

  const aggregateComments = CommentModel.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "commenter",
        foreignField: "_id",
        as: "commenter",
        pipeline: [
          {
            $project: {
              avatar: 1,
              fullname: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $addFields: {
        likeCount: {
          $size: "$likes",
        },
        commenter: { $first: "$commenter" },
      },
    },
    {
      $project: {
        commenter: 1,
        contend: 1,
        video: 1,
        createdAt: 1,
        likeCount: 1,
      },
    },
  ]);

  const comments = await CommentModel.aggregatePaginate(
    aggregateComments,
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comments?.docs, "Fetched comments"));
});

export { getVideoComment };
