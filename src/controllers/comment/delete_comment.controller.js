import { CommentModel } from "../../models/comment.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const deleteComment = asyncHandler(async (req, res) => {
  /*
    -> get commentId from request params  
    -> check and delete comment 
    -> return response 
    */

  const { commentId } = req.params;

  const deletedComment = await CommentModel.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw new ApiError(404, "Comment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteComment, "Comment deleted successfully"));
});

export { deleteComment };
