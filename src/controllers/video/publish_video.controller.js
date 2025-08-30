import { VideoModel } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

const publishVideo = asyncHandler(async (req, res) => {
  /**
  -> get title and description from frontend 
  -> validate is empty
  -> get thumbnail and video from local and validate is empty 
  -> upload thumbnail and video on cloudinary
  -> check errors 
  -> create new video object with thumbnail url and video url and added others information
  -> return response 
 */
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "All field is required");
  }

  let thumbnailLocalPath;
  let videoLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail?.length
  ) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }
  if (req.files && Array.isArray(req.files.video) && req.files.video?.length) {
    videoLocalPath = req.files.video[0].path;
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }
  if (!videoLocalPath) {
    throw new ApiError(400, "Video is required");
  }

  const video = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(500, "Thumbnail upload failed");
  }

  if (!video) {
    throw new ApiError(500, "Video upload failed");
  }

  const newVideo = await VideoModel.create({
    title,
    description,
    videoUrl: video.url,
    thumbnail: thumbnail.url,
    owner: req.user?._id,
    duration: video.duration,
    isPublished: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newVideo, "Video uploaded successfully"));
});

export { publishVideo };
