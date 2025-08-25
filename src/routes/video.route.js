import { Router } from "express";
import { getVideos } from "../controllers/video/getVideos.controller.js";
import { publishVideo } from "../controllers/video/publishVideo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/").get(getVideos);
router.route("/upload").post(
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

export default router;
