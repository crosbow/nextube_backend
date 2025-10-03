import { Router } from "express";
import { deleteVideo } from "../controllers/video/delete_video.controller.js";
import { getVideo } from "../controllers/video/get_video.controller.js";
import { getVideos } from "../controllers/video/get_videos.controller.js";
import { publishVideo } from "../controllers/video/publish_video.controller.js";
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
router.route("/watch/:videoId").get(verifyJWT, getVideo);
router.route("/toggle-publish/:videoId").patch(verifyJWT, togglePublishStatus);
router.route("/delete/:videoId").delete(verifyJWT, deleteVideo);
router
  .route("/update-video/:videoId")
  .post(upload.single("thumbnail"), verifyJWT, updateVideo);

export default router;
