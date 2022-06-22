import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GuestLogin from "./components/main/GuestLogin/index.jsx";
import About from "./components/main/About/index.jsx";
import Terms from "./components/main/Terms/index.jsx";
import CreatePost from "./components/main/CreatePost/index.jsx"
import LoggedInNoPosts from "./components/main/LoggedInNoPosts/index.jsx"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Axios from "axios"
Axios.defaults.baseURL = "http://localhost:8080"

function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("socialMediatoken")));
  return (
    <Router>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      <Routes>
        <Route path="/" exact element={loggedIn ? <LoggedInNoPosts/> : <GuestLogin/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/terms" element={<Terms/>}/>  
        <Route path="/create-post" element={loggedIn ? <CreatePost/> : <GuestLogin/>}/>  
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
