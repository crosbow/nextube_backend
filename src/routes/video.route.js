import { Router } from "express";
import { getVideo } from "../controllers/video/getVideo.controller.js";
import { getVideos } from "../controllers/video/getVideos.controller.js";
import { publishVideo } from "../controllers/video/publishVideo.controller.js";
import { togglePublishStatus } from "../controllers/video/toggle_publish_status.controller.js";
import { updateVideo } from "../controllers/video/update_video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getVideos);
router.route("/upload").post(
  verifyJWT,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  publishVideo
);

// /watch?videoId=ID
router.route("/watch").get(verifyJWT, getVideo);
router.route("/toggle-publish").patch(verifyJWT, togglePublishStatus);
router.route("/toggle-publish").patch(verifyJWT, togglePublishStatus);
router.route("/update-video").patch(verifyJWT, updateVideo);

export default router;
