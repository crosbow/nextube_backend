import { PlaylistModel } from "../../models/playlist.model.js";
import { UserModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getUserPlaylists = asyncHandler(async (req, res) => {
  /*
    -> get user id from request params 
    -> check if user exist
    -> get user all playlists 
    -> return response
    */
  const { userId } = req.params;

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const playlists = await PlaylistModel.find({
    owner: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Fetched playlists"));
});

export { getUserPlaylists };
