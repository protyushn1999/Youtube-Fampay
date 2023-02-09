import { useState,useEffect } from "react";

const ViewAll = () => {
    /* use states to manage videos and loading */
    const [totalVideos, setTotalVideos] = useState(0);
    const [videos,setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:9000/all-videos")
            .then((res) => res.json())
            .then((data) => {
                console.log("total videos is", data.count);
                setTotalVideos(data.count);
            });
    },[]);

    /* fetch paginated data according to page and limit from the backend server */ 
    
    const fetchDataPagination = async(page,limit) => {
        const  response = await fetch('http://localhost:9000/paginated-videos?page='+page+'&limit='+limit)
        .then((response) => response.json())
        .then((data) => {
        setVideos(data);
        setLoading(false);
        console.log(data);
        })
        return response;
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(e.target[0].value);
        console.log(e.target[1].value);
        var page = e.target[0].value;
        var limit = e.target[1].value;

        /* now we call a function that will fetch the paginated videos and display them on the page */
        
        fetchDataPagination(page,limit);
    }

    return (
        <div className="paginated-view">
           <div className="header">
                <h2>Total number of videos in database -  {totalVideos}</h2>
                <h4>Choose your page and limit to view the videos</h4>
                <form onSubmit={handleSubmit} className = 'pagelimitform dis-flex'>
                    <input type="number" name="page" id="page" placeholder="page number"  />
                    <input type="number" name="limit" id="limit"  placeholder="limit for each page"/>
                    <button type="submit" className="paginated load-btn">Load</button>
                </form>
                <p>By Default, this will show all the videos in the database. Choose the page number and the limit for each page to see the respective page videos sorted in descending order of published datetime.</p>
            </div> 
            
            <div className="videos-pagination dis-flex">
                {loading && <div className="loading"><p>Loading the videos for the given page number and limit ...</p></div>}
                {videos.map((item,index) =>{
                    return(
                        <div className="video">
                          <div className="video-title">
                            <h4>{item.title}</h4>
                          </div>
                          
                          <div className="video-thumbnail">
                          <a href={"http://www.youtube.com/embed/" + item.videoid} target="_blank"><img src={item.thumbnails} alt="thumbnail" /></a>
                          </div>
                        </div>
                      )
                })}
            </div>
            
            

        </div>
    );
}
 
export default ViewAll;