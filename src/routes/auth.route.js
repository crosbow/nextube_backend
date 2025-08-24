import { Router } from "express";
import { loginUser } from "../controllers/auth/login.controller.js";
import { logoutUser } from "../controllers/auth/logout.controller.js";
import { refreshAccessToken } from "../controllers/auth/refresh_token.controller.js";
import { registerUser } from "../controllers/auth/register.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

const multerUploadOptions = [
  {
    name: "avatar",
    maxCount: 1,
  },
  {
    name: "coverImage",
    maxCount: 1,
  },
];

router
  .route("/register")
  .post(upload.fields(multerUploadOptions), registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
