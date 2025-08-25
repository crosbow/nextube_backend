import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const tweetSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    contend: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

tweetSchema.plugin(aggregatePaginate);

export const TweetModel = mongoose.model("Tweet", tweetSchema);
