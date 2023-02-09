import mongoose from "mongoose";

/* Video Schema to save the videos in mongoose*/

const videoSchema = new mongoose.Schema({
    videoid: {
        type: String,
        unique: true,
        required: true
      },
      publishedate: {
        type: String,
    
      },
      channelid: {
        type: String,
      },
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      thumbnails: {
        type: String,
      },
      channelTitle: {
        type: String,
      }
})

export const Video = mongoose.model("Video", videoSchema);