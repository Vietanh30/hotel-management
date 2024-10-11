import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import path from "./constants/path";
import Home from "./pages/User/Home/Home";

function App() {  
  return (
      <Router>
        <Routes>
         
          <Route path={path.home} element={<Home />} />
          
        </Routes>
      </Router>
  );
}

export default App;