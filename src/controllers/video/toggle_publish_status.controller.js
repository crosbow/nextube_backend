import { VideoModel } from "../../models/video.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const togglePublishStatus = asyncHandler(async (req, res) => {
  /*
     -> get video id from request params
     -> find video by its id and update toggle publish 
     -> return toggled api response 
    */

  const { videoId } = req.params;

  await VideoModel.findByIdAndUpdate(videoId, {
    $set: {
      isPublished: { $not: "$isPublished" },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Toggle publish video status"));
});

export { togglePublishStatus };
