import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String, // cloudinary video url
      required: true,
    },
    thumbnail: {
      type: String, // cloudinary img url
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "Title is at least 10 characters long"],
      maxlength: [55, "Title max length exceeded"],
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

videoSchema.plugin(aggregatePaginate); // note: using aggregation pipelines (e.g., $match, $lookup, $group, $sort), normal skip and limit can get messy. That’s where mongoose-aggregate-paginate-v2 helps.

export const VideoModel = mongoose.model("Video", videoSchema);
