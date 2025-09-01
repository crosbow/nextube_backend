import { Router } from "express";
import { addVideoToPlaylist } from "../controllers/playlist/add_video_to_playlist.controller.js";
import { createPlaylist } from "../controllers/playlist/create_playlist.controller.js";
import { deletePlaylist } from "../controllers/playlist/delete_playlist.controller.js";
import { getPlaylist } from "../controllers/playlist/get_playlist.controller.js";
import { getUserPlaylists } from "../controllers/playlist/get_user_playlists.controller.js";
import { removeVideoFromPlaylist } from "../controllers/playlist/remove_video_from_playlist.controller.js";
import { updatePlaylist } from "../controllers/playlist/update_playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/create").post(createPlaylist);
router.route("/update/:playlistId").patch(updatePlaylist);
router.route("/delete/:playlistId").delete(deletePlaylist);
router.route("/add-video/:playlistId/:videoId").patch(addVideoToPlaylist);
router
  .route("/remove-video/:playlistId/:videoId")
  .patch(removeVideoFromPlaylist);
router.route("/user/:userId").get(getUserPlaylists);
router.route("/:playlistId").get(getPlaylist);

export default router;
