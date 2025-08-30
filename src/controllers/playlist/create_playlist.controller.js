import { PlaylistModel } from "../../models/playlist.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  /*
    -> get playlist name, description from request body 
    -> validate 
    -> create playlist (owner and videos is default)
    -> return response 
    */

  const { name, description } = req.body;

  if (!name.trim() || !description.trim()) {
    throw new ApiError(400, "All fields are required");
  }

  const newPlaylist = await PlaylistModel.create({
    owner: req.user._id,
    name,
    description,
  });

  return res.status(200).json(200, newPlaylist, "Playlist created");
});

export { createPlaylist };
