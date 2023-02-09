# Backend Assignment | FamPay

## Project Goal
To make an API to fetch latest videos sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.

## Basic Requirements
- Server should call the YouTube API continuously in background (async) with some interval (say 10 seconds) for fetching the latest videos for a predefined search query and should store the data of videos (specifically these fields - Video title, description, publishing datetime, thumbnails URLs and any other fields you require) in a database with proper indexes.
- A GET API which returns the stored video data in a paginated response sorted in descending order of published datetime.
- A basic search API to search the stored videos using their title and description.
- Dockerize the project.
- It should be scalable and optimised.

## Bonus Points:
- Add support for supplying multiple API keys so that if quota is exhausted on one, it automatically uses the next available key.
- Make a dashboard to view the stored videos with filters and sorting options (optional)
- Optimise search api, so that it's able to search videos containing partial match for the search query in either video title or description.
    - Ex 1: A video with title *`How to make tea?`* should match for the search query `tea how`

##   Reference:

- YouTube data v3 API: [https://developers.google.com/youtube/v3/getting-started](https://developers.google.com/youtube/v3/getting-started)
- Search API reference: [https://developers.google.com/youtube/v3/docs/search/list](https://developers.google.com/youtube/v3/docs/search/list)
    - To fetch the latest videos you need to specify these: type=video, order=date, publishedAfter=<SOME_DATE_TIME>
    - Without publishedAfter, it will give you cached results which will be too old

## Brief Description of the Project
The project is build with NodeJs, Express and Mongo DB as Backend and React in the frontend. I have created APIs which can fetch most reccent videos from youtube and show the user in a paginated way sorted in descending order of published datetime. The cron job will getch data every 10 secs from Youtube Db and save in our db. Additionally, it will store information about videos, including their ID, publication date, channel ID, title, description, thumbnails, and channel title with proper indexes. Further, I have used compound indexing to optimise the searching of videos using a particular keyword. When the API_KEY quota is used up, it automatically switches to the 4 other keys until success response.

## How to run the project

- Clone the project to your desktop
- Go to client and server directory and run  **npm install** to install all the dependencies for frontend and backend.
- Update the mongodb URL with your local mongodb URL
- Run the backend and frontend by running **npm start** in separate terminals

## How to test the APIs

- The frontend will launch at PORT 3000 and backend at port 9000
- Wait few secs for cronjob to populate the data in mongoDB server

    ### Testing the backend APIs (You can use POSTMAN for the same)
    
    - For searching a particular keyword based in title and description , we have to create an index on both.This can be achieved by following command in mongodb shell (db.videos.createIndex( { "title": "text", "description": "text" } ))
    -  For searching any particular video based on title or description - Make a GET request to (http://localhost:9000/search?q={query}). This is give all the videos matching the keyword.
    -  For getting all the videos saved in the database in a paginated response sorted in descending order ofpublished datetime - Make a GET request to (http://localhost:9000/paginated-videos?page={pageNum}&limit={Limit}) to get the particular page videos and corresponding data.
    -  For getting the video based on videoid - Make a GET request to (http://localhost:9000/video/:videoid). This will return the json data for the video and its corresponding youtube URL.
    -  For getting all the videos - Make a GET request to (http:localhost:9000/all-videos). It will return all the videos along with count in JSON format.
    
    ### Testing the frontend
    
    - The server would launch (http://localhost:3000/) which is the search page. It internally calls the search API based on title and description.
    - User can view all the saved videos by clicking on (View all videos) button on the search page which redirects the user to (http://localhost:3000/paginated-videos). User can now choose the page number and limit per page to view the video for the particular page sorted according to descending order of published datetime. NOTEL: The product of given page and limit should not exceed the total video in the database.
    - By default clicking the load button will load the videos currently present in the database.


Note :  Please restart a server if any unnecessary errors occurred.
