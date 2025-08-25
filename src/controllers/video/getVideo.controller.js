import { VideoModel } from "../../models/video.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getVideo = asyncHandler(async (req, res) => {
  /*
    -> get video id from req.params.videoId 
    -> find video by that id 
    -> return full video info 
    */

  const { videoId } = req.query;

  const video = await VideoModel.findById(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"));
});

export { getVideo };
