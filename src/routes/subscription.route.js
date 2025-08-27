import { Router } from "express";
import { getChannelSubscribers } from "../controllers/subscription/get_channel_subscribers.controller.js";
import { getSubscribedChannels } from "../controllers/subscription/get_subscribed_channels.controller.js";
import { toggleSubscription } from "../controllers/subscription/toggle_subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/toggle/:channelId").post(toggleSubscription);
router.route("/subscribers/:channelId").get(getChannelSubscribers);
router.route("/subscribed/:subscriberId").get(getSubscribedChannels);

export default router;
