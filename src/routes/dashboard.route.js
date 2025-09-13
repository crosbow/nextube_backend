import { Router } from "express";
import { getChannelDashboard } from "../controllers/dashboard/get_channel_dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/stats").get(getChannelDashboard);

export default router;
