import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

var whitelist = [process.env.CORS_ORIGIN, "http://localhost:5173"];

app.use(
  cors({
    origin: whitelist,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // Allows json and limit of the json file size
app.use(express.urlencoded({ extended: true })); // parses incoming URL-encoded form data (like data submitted via HTML forms).
app.use(express.static("public")); // This serves static files (images, CSS, PDFs, etc.) directly from the public/ folder.
app.use(cookieParser()); // Allows read cookies sent by the client and also send cookies back.

// import routes
import authRouter from "./routes/auth.route.js";
import commentRouter from "./routes/comment.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import likeRouter from "./routes/like.route.js";
import playlistRouter from "./routes/playlist.route.js";
import subscriptionSchema from "./routes/subscription.route.js";
import tweetRouter from "./routes/tweet.route.js";
import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";

// routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/subscriptions", subscriptionSchema);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// http://localhost:8000/api/v1/auth

export { app };
