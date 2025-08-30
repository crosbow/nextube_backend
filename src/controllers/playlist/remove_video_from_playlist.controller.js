import mongoose from "mongoose";
import { PlaylistModel } from "../../models/playlist.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  /*
    -> get videoId and playlistId from request params 
    -> validate is empty 
    -> remove video from playlist 
    -> return response
    */

  const { videoId, playlistId } = req.params;

  if (!videoId || !playlistId) {
    throw new ApiError(400, "All params is required");
  }

  const removeVideo = await PlaylistModel.findByIdAndUpdate(
    playlistId,
    {
      $pull: { videos: new mongoose.Types.ObjectId(videoId) },
    },
    { new: true }
  );

  return res
    .status(201)
    .json(200, new ApiResponse(200, removeVideo, "Added video in playlist."));
});

export { removeVideoFromPlaylist };
