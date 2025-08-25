import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    likeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
  },
  {
    timestamps: true,
  }
);

export const LikeModel = mongoose.model("Like", likeSchema);
