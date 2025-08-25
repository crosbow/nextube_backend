import { asyncHandler } from "../../utils/asyncHandler.js";

const updateVideo = asyncHandler(async (req, res) => {
  /**
      -> get data frontend to update - title, description, thumbnail
      -> check which one is to update 
      -> if thumbnail is to update then update it and validate - remove old image from cloudinary
      -> update video in DB 
      -> return response 
     */
});

export { updateVideo };
