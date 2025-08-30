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

  const playlist = await PlaylistModel.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Fetched playlist"));
});

export { getPlaylist };
