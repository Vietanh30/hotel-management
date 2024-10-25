import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import path from "./constants/path";
import Home from "./pages/User/Home/Home";
import Login from "./pages/User/Login/Login";
import Register from "./pages/User/Register/Register";
import Booking from "./pages/User/Booking/Booking";
import ForgotPassword from "./pages/User/ForgotPassword/ForgotPassword";
import Checkout from "./pages/User/Checkout/Checkout";

function App() {  
  return (
      <Router>
        <Routes>
         
          <Route path={path.home} element={<Home />} />
          <Route path={path.login} element={<Login />} />
          <Route path={path.register} element={<Register />} />
          <Route path={path.forgotPassword} element={<ForgotPassword />} />
          <Route path={path.booking} element={<Booking />} />
          <Route path={path.checkout} element={<Checkout />} />
          
        </Routes>
      </Router>
  );
}

export default App;