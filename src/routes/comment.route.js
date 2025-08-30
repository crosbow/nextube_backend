import { Router } from "express";
import { addComment } from "../controllers/comment/add_video_comment.controller.js";
import { deleteComment } from "../controllers/comment/delete_comment.controller.js";
import { getVideoComment } from "../controllers/comment/get_video_comments.controller.js";
import { updateVideoComment } from "../controllers/comment/update_video_comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/video-comment/:videoId").get(getVideoComment);

router.route("/video-comment").post(addComment);

router.route("/video-comment/:videoId").patch(updateVideoComment);
router.route("/video-comment/:commentId").delete(deleteComment);

export default router;
