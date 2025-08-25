import { asyncHandler } from "../../utils/asyncHandler.js";

const deleteVideo = asyncHandler(async (req, res) => {
  /**
      -> get video id from request params
      -> get video from db 
      -> remove thumbnail using its public id 
      -> then remove video following same steps 
      -> remove user from DB 
     */
});

export { deleteVideo };
