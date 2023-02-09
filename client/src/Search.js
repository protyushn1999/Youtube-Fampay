import { useState} from "react";


const Search = () => {


    const [data, setData] = useState([]);

    /* fetching videos from backend server for the given search query */
    
    const fetchData = async(query) => {
        const  response = await fetch('http://localhost:9000/search?q='+ query)
        .then((response) => response.json())
        .then((data) => {
        setData(data);
        console.log(data);
        })
        return response;
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        var query = e.target[0].value;
        e.target[0].value = "";
        fetchData(query);
    }

    return (   
    <div className="app">
        <div className="content">
        Welcome to the search page of youtube lite. You can search for saved videos by entering a search term. All matching videos will be displayed.
        Click on a video to play it. You can view all the saved videos by clicking on the "View All" button in a paginated manner.
      </div>
      <div className="form-group">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search Video by keywords"
            name = "seachTerm"/>
        </form>

      </div>
      <div className="paginated">
        <a href="http://localhost:3000/paginated-videos">View All Videos</a>
      </div>
      <div className="videos">
        
      {
        data.map((item,index) =>{
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
        })
      }
      </div>
    </div> 
    );
}
 
export default Search;