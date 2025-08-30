import { PlaylistModel } from "../../models/playlist.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

const deletePlaylist = asyncHandler(async (req, res) => {
  /*
    -> get playlist id from request params 
    -> delete playlist 
    -> return response 
    */

  const { playlistId } = req.params;

  const deletedPlaylist = await PlaylistModel.findByIdAndDelete(playlistId);

  if (!deletePlaylist) {
    throw new ApiError(400, "playlistId is invalid");
  }

  return req.status(200).json(new ApiResponse(200, deletedPlaylist));
});

export { deletePlaylist };
