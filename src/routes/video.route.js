import { Router } from "express";
import { getVideos } from "../controllers/video/getVideos.controller.js";

const router = Router();

router.route("/").get(getVideos);

export default router;
