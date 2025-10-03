import { PlaylistModel } from "../../models/playlist.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const deletePlaylist = asyncHandler(async (req, res) => {
  /*
    -> get playlist id from request params 
    -> delete playlist 
    -> return response 
    */

  const { playlistId } = req.params;

  const deletedPlaylist = await PlaylistModel.findByIdAndDelete(playlistId);

  if (!deletedPlaylist) {
    return res.status(400).json(new ApiError(400, "playlist not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Playlist Deleted Successfully"));
});

export { deletePlaylist };
