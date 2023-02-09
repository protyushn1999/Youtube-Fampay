import mongoose from 'mongoose';


/*  connect to the database server */

try{
    /* Chnage the url to your local host mongo db url */
    mongoose.connect("mongodb://localhost:27017/yt-v1", {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connection.on("connected", () => {
        console.log("Connected to mongodb");
    });
}catch(err){
    console.log(err);
}

export default mongoose;