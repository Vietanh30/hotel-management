import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import path from "./constants/path";
import Home from "./pages/User/Home/Home";
import Login from "./pages/User/Login/Login";
import Register from "./pages/User/Register/Register";
import Booking from "./pages/User/Booking/Booking";

function App() {  
  return (
      <Router>
        <Routes>
         
          <Route path={path.home} element={<Home />} />
          <Route path={path.login} element={<Login />} />
          <Route path={path.register} element={<Register />} />
          <Route path={path.booking} element={<Booking />} />
          
        </Routes>
      </Router>
  );
}

export default App;