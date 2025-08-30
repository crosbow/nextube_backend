import { CommentModel } from "../../models/comment.model.js";
import { VideoModel } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addComment = asyncHandler(async (req, res) => {
  /*
    -> get comment contend and videoId from request body
    -> validate
    -> create a new comment, commenter is req.user._id 
    -> return response 
    */

  const { contend, videoId } = req.body;
  const commenterId = req.user._id;

  if (!contend.trim || !videoId) {
    throw new ApiError(400, "All field is required");
  }

  const isVideoExist = await VideoModel.findById(videoId);

  if (!isVideoExist) {
    throw new ApiError(404, "Video not found");
  }

  const comment = await CommentModel.create({
    commenter: commenterId,
    contend,
    video: videoId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Add comment on video successfully"));
});

export { addComment };
