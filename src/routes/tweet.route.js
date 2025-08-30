import { Router } from "express";
import { createTweet } from "../controllers/tweet/create_tweet.controller.js";
import { deleteTweet } from "../controllers/tweet/delete_tweet.controller.js";
import { getUserTweets } from "../controllers/tweet/get_user_tweets.controller.js";
import { updateTweet } from "../controllers/tweet/update_tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/create").post(createTweet);
router.route("/:userId").get(getUserTweets);
router.route("/update/:tweetId").patch(updateTweet);
router.route("/delete/:tweetId").delete(deleteTweet);

export default router;
