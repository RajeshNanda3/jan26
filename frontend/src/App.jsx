import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import { AppData } from "./context/AppContext";
import Loading from "./Loading";
import NavBar from "./components/NavBar";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";


const App = () => {
  const { isAuth, loading } = AppData();
  console.log(isAuth)
  return (
    <>
    
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
        <NavBar/>
          <Routes>
            
            <Route path="/" element={isAuth ? <Home /> : <Login />} />
            <Route path="/contact" element= <Contact/>/>
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/verify-otp"
              element={isAuth ? <Home /> : <VerifyOtp />}
            />
            <Route
              path="/token/:token"
              element={isAuth ? <Home /> : <Verify />}
            />
            <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Login />} />
          </Routes>
          <Footer/>
          <ToastContainer />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
