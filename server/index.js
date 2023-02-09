import express from "express";
import mongoose from "./config/mongoose.js";
import { Video } from "./models/video.js";
import fetch from "node-fetch";
import cron from "node-cron";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";

/* Conifgurations  Started */

const __dirname = path.resolve();
const tempPath = path.join(__dirname, "./views");
console.log(tempPath);
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

const port = process.env.PORT || 9000;

/* Conifgurations  Ended */

/* variables for url */

const maxResults = 20;
const searchQueryArray = ["cricket","football","MSD","world cup","technology","official","DSA","kohli","messi","ronaldo","song","wwe","t series","espn","bollywood","songs","spanish","india","mr beast","pewdiepie","music","fortnite"]
const publishedAfter = "1990-01-01T00:00:00Z";
/* update these 4 keys with your youtube api key */
const YOUTUBE_API_KEY =["AIzaSyA_-rPZs3awM5ZjZB2m8u02ctOgclC3a40","AIzaSyBhjipO7d7TjFkE-JiqbYZ9NQgoIf0p5hA","AIzaSyDEfnt0fzwZdjQ80QjELJTbNIQMGV-pu6M","AIzaSyD1m9hE9yLgNwe3w6puKXNxKZXQ_ODe4aU"];

/* APP ROUTING */

/* BASE_URL = s
    /video/:videoid - get video by id
    /search?q={query} - search video by title or description
    /paginated-videos?page={pageNum}&limit={Limit} - get paginated videos
    /all-videos - get all videos with total count of videos
    / - home page
*/

/* app.route("/") */

app.get("/", (req, res) => {
  res.render("index");
});

/* fetching the data from youtube data API v3 and save it to mongodb database */

const fetchData = async () => {

  /* choosing a random word from the searchQueryArray */
  const searchQuery = searchQueryArray[Math.floor(Math.random() * searchQueryArray.length)];

  var url =
  "https://youtube.googleapis.com/youtube/v3/search?key=" +
  YOUTUBE_API_KEY[0] +
  "&type=video&part=snippet&maxResults=" +
  maxResults +
  "&q=" +
  searchQuery +
  "&order=date&publishedAfter=" +
  publishedAfter +
  "&location=40.7128,74.0060&locationRadius=1000km";

  var response = await fetch(url);

  /* until and unless a success response is found this will change the API Key fetch for data */

  while(response.status !== 200){

    var API_KEY = YOUTUBE_API_KEY[Math.floor(Math.random() * YOUTUBE_API_KEY.length)];

    url =
    "https://youtube.googleapis.com/youtube/v3/search?key=" +
    API_KEY +
    "&type=video&part=snippet&maxResults=" +
    maxResults +
    "&q=" +
    searchQuery +
    "&order=date&publishedAfter=" +
    publishedAfter +
    "&location=40.7128,74.0060&locationRadius=1000km";

    response = await fetch(url);
  }

  const data = await response.json();
  const videos = data.items;

  if (videos.length > 0) {
    for (let i = 0; i < videos.length; i++) {

      /* creating a new video object to be saved in mongo DB */

      const newVideo = new Video({
        videoid: videos[i].id.videoId,
        publishedate: videos[i].snippet.publishedAt,
        channelid: videos[i].snippet.channelId,
        title: videos[i].snippet.title,
        description: videos[i].snippet.description,
        thumbnails: videos[i].snippet.thumbnails.high.url,
        channelTitle: videos[i].snippet.channelTitle,
      });

      /* Checking the current video exist in the database and if it exists
             then it will not save it to the database else it will create a new one */

      Video.findOne({ videoid: videos[i].id.videoId }, (err, video) => {
        if (err) {
          console.log(err);
        }
        if (video) {
          console.log("Video already exists in the database");
        } else {
          newVideo.save((err, video) => {
            if (err) {
              console.log(err);
            }
            console.log("video saved in db",video);
          });
        }
      });
    }
  }
};

/* GET api by video id
app.route("/video/:videoid") */

app.get("/video/:videoid", (req, res) => {
  Video.findOne({ videoid: req.params.videoid }, (err, video) => {
    if (err) {
      console.log(err);
    }
    if (video) {
      const videoUrl = "https://www.youtube.com/watch/" + video.videoid;
      const response = {
        videoUrl: videoUrl,
        video: video,
      };
      res.send(response);
    } else {
      res.send("Video not found");
    }
  });
});

/* GET api for searching any particular video by title or description
All the rows that matches the search query will be returned */

app.get("/search", async (req, res) => {

  /* search query 
  NOTE: It is important to create index on title and description field in the database as text.
  it can be done by this command in mongodb shell db.videos.createIndex( { "title": "text", "description": "text" } ) or 
  directly creating compound index in mongo db compass.
  */

  const searchQuery = req.query.q;
  const query = { $text: { $search: searchQuery } };
  const result = await Video.find(query);
  if (result.length > 0) {
    res.send(result);
  } else {
    res.send("No video found");
  }
});

/* GET api to return all the saved videos in the database 
in a paginated response sorted in decreasing order of published date. 
typical URL - "http:localhost:8000/videos?page=1&limit=10" */

app.get("/paginated-videos", (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  console.log("page number requested",page);
  console.log("limit for each page",limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  /* searching for the video in the database and changing te page number and limits accordingly */
  Video.find()
    .sort({ publishedate: -1 })
    .limit(limit)
    .skip(startIndex)
    .exec((err, videos) => {
      if (err) {
        console.log(err);
      }
      if (videos) {
        results.results = videos;
        if (endIndex < videos.length) {
          results.next = {
            page: page + 1,
            limit: limit,
          };
        }
        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit,
          };
        }
        res.send(videos);
      } else {
        res.send("No videos found");
      }
    });
});

/* GET api to fetch all the videos from the database */

app.get("/all-videos", (req,res) => {
    Video.find({}, (err, videos) => {
        if(err) {
            console.log(err);
        }
        if(videos) {
            var data = {
                count: videos.length,
                results: videos
                
            }
            res.send(data);
        } else {
            res.send("No videos found");
        }
    })
})

/* Cron job to run the fetchData function every 10 seconds */

cron.schedule('*/10 * * * * *', () => {
    console.log('running the cron job');
    fetchData();
})

/* start the  expresss server */

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server started at http://localhost:${port}`);
});
