import { Router } from "express";
import { registerUser } from "../controllers/auth/auth.controller.js";
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

export default router;
