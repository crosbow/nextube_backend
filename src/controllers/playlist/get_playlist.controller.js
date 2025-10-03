import mongoose from "mongoose";
import { PlaylistModel } from "../../models/playlist.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getPlaylist = asyncHandler(async (req, res) => {
  /*
    -> get playlist id from request params 
    -> find playlist and validate 
    -> return response 
    */

  const { playlistId } = req.params;

  const playlist = await PlaylistModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $project: {
              title: 1,
              description: 1,
              videoUrl: 1,
              thumbnail: 1,
              duration: 1,
              createdAT: 1,
              views: 1,
            },
          },
        ],
      },
    },
  ]);

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "playlist not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Fetched playlist"));
});

export { getPlaylist };
