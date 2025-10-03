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
    return res.status(400).json(new ApiError(400, "All params is required"));
  }

  const removeVideo = await PlaylistModel.findByIdAndUpdate(playlistId, {
    $pull: { videos: new mongoose.Types.ObjectId(videoId) },
  });
  console.log(removeVideo);

  if (!removeVideo.videos.length) {
    return res.status(404).json(new ApiError(404, "Video doesn't exist"));
  }

  const playlist = await PlaylistModel.findById(playlistId);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Removed video from playlist."));
});

export { removeVideoFromPlaylist };
