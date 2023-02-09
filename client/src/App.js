import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './index.css';
import './App.css';
import Search from './Search';
import ViewAll from './ViewAll';


function App() {
  return (
    <Router>
    <div className="application">
      <div className="logo">
        <a href="/"><h1>Youtube Lite</h1></a>
      </div>
      <Routes>
        <Route exact path='/' element={<Search/>}/>
            
        <Route exact path='/paginated-videos' element= {<ViewAll/>}/>
      </Routes>
    </div>
  </Router>
  );
}

export default App;
