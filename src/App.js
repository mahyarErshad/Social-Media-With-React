import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GuestLogin from "./components/main/GuestLogin/index.jsx";
import About from "./components/main/About/index.jsx";
import Terms from "./components/main/Terms/index.jsx";
import CreatePost from "./components/main/CreatePost/index.jsx";
import LoggedInNoPosts from "./components/main/LoggedInNoPosts/index.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Axios from "axios";
import ViewPosts from "./components/main/ViewPosts";
import FlashMesaages from "./components/FlashMesaages/FlashMesaages";
import MyContext from "./MyContext";
Axios.defaults.baseURL = "http://localhost:8080";

function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("socialMediatoken")));
  const [flashMessages, setFlashMessages] = useState([]);
  function addFlashMessages(msg) {
    setFlashMessages((prev) => prev.concat(msg));
  }

  return (
    <MyContext.Provider value={{addFlashMessages , loggedIn , setLoggedIn}}>
      <Router>
        <Header />
        <FlashMesaages messages={flashMessages} />
        <Routes>
          <Route path="/" exact element={loggedIn ? <LoggedInNoPosts /> : <GuestLogin />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/posts/:id" element={<ViewPosts />} />
          <Route path="/create-post" element={loggedIn ? <CreatePost /> : <GuestLogin />} />
        </Routes>
        <Footer />
      </Router>
    </MyContext.Provider>
  );
}

export default App;
