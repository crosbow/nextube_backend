import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new mongoose.Schema(
  {
    commenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    contend: {
      type: String,
      required: true,
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

commentSchema.plugin(aggregatePaginate);

export const CommentModel = mongoose.model("Comment", commentSchema);
