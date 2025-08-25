import { Router } from "express";
import { resetPassword } from "../controllers/user/reset_password.controller.js";
import { updateDetails } from "../controllers/user/update_details.controller.js";
import {
  updateAvatar,
  updateCoverImage,
} from "../controllers/user/update_image_files.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// router.use(verifyJWT);
router.route("/reset-password").patch(resetPassword);
router.route("/update-details").patch(updateDetails);
router.route("/change-avatar").patch(upload.single("avatar"), updateAvatar);
router
  .route("/change-cover-image")
  .patch(upload.single("avatar"), updateCoverImage);
router.route("/c/:username");

export default router;
