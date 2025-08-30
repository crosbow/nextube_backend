import { PlaylistModel } from "../../models/playlist.model.js";
import { VideoModel } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  /*
    -> get videoId and playlistId from request params 
    -> validate is empty 
    -> validate video and playlist exist 
    -> add videoId in playlist videos
    -> return response
    */

  const { videoId, playlistId } = req.params;

  if (!videoId || !playlistId) {
    throw new ApiError(400, "All params is required");
  }

  const video = await VideoModel.findById(videoId);
  const playlist = await PlaylistModel.findById(playlistId);

  if (!video || playlist) {
    throw new ApiError(400, "Video or playlist might not exist");
  }

  const addVideo = await PlaylistModel.findByIdAndUpdate(
    playlistId,
    {
      $push: { videos: videoId },
    },
    { new: true }
  );

  return res
    .status(201)
    .json(200, new ApiResponse(200, addVideo, "Added video in playlist."));
});

export { addVideoToPlaylist };
