import { CommentModel } from "../../models/comment.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const updateVideoComment = asyncHandler(async (req, res) => {
  /*
    -> get comment id and new contend from request body 
    -> validate if comment exist
    -> update contend 
    -> return response 
    */

  const { videoId } = req.params;
  const { newContend } = req.body;

  if (!videoId.trim() || !newContend.trim()) {
    return res
      .status(400)
      .json(new ApiError(400, "videoId and newContend field is required"));
  }

  const isCommentExist = await CommentModel.findById(videoId);

  if (!isCommentExist) {
    return res.status(404).json(new ApiError(404, "Comment is not exist"));
  }

  const updatedComment = await CommentModel.findByIdAndUpdate(
    videoId,
    {
      $set: {
        contend: newContend,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

export { updateVideoComment };
