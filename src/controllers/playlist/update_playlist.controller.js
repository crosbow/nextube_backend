import { PlaylistModel } from "../../models/playlist.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const updatePlaylist = asyncHandler(async (req, res) => {
  /*
    -> get playlist id from request params
    -> get name, and description from request body 
    -> if both empty throw error 
    -> validate - name or description is required 
    -> update playlist 
    -> return response 
    */

  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!name && !description) {
    throw new ApiError(
      400,
      "Field name or description is required for this operation"
    );
  }

  const nonEmptyFields = {};
  if (name) {
    nonEmptyFields.name = name;
  }

  if (description) {
    nonEmptyFields.description = description;
  }

  const updatedPlaylist = await PlaylistModel.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        ...nonEmptyFields,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    );
});

export { updatePlaylist };
