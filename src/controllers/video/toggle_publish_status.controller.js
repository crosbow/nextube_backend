import { asyncHandler } from "../../utils/asyncHandler.js";

const togglePublishStatus = asyncHandler(async (req, res) => {
  /*
     -> get video id from request params
     -> find video by its id and update toggle publish 
     -> return toggled api response 
    */
});

export { togglePublishStatus };
