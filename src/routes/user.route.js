import { Router } from "express";
import { getChannelProfile } from "../controllers/user/get_channel_profile.controller.js";
import { getCurrentUser } from "../controllers/user/get_current_user.controller.js";
import { getUserHistory } from "../controllers/user/get_history.controller.js";
import { resetPassword } from "../controllers/user/reset_password.controller.js";
import { updateDetails } from "../controllers/user/update_details.controller.js";
import {
  updateAvatar,
  updateCoverImage,
} from "../controllers/user/update_image_files.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/current-user").get(getCurrentUser);
router.route("/c/:username").get(getChannelProfile);
router.route("/history").get(getUserHistory);
router.route("/reset-password").post(resetPassword);
router.route("/update-account").patch(updateDetails);
router.route("/change-avatar").patch(upload.single("avatar"), updateAvatar);
router.route("/change-cover").patch(upload.single("avatar"), updateCoverImage);

export default router;
