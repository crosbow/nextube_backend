import { Router } from "express";
import { getLikedVideos } from "../controllers/like/get_liked_videos.controller.js";
import { toggleLike } from "../controllers/like/toggle_like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/toggle").post(toggleLike);
router.route("/liked-videos").get(getLikedVideos);

export default router;
