import React, { useReducer } from "react";

//components
import Header from "./components/Header";
import Footer from "./components/Footer";
import GuestLogin from "./components/main/GuestLogin/index.jsx";
import About from "./components/main/About/index.jsx";
import Terms from "./components/main/Terms/index.jsx";
import CreatePost from "./components/main/CreatePost/index.jsx";
import LoggedInNoPosts from "./components/main/LoggedInNoPosts/index.jsx";
import ViewPosts from "./components/main/ViewPosts";

//contexts
import DispatchContext from "./Context/DispatchContext";
import StateContext from "./Context/StateContext";

//utils
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Axios from "axios";
import FlashMesaages from "./components/FlashMesaages/FlashMesaages";
Axios.defaults.baseURL = "http://localhost:8080";

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("socialMediatoken")),
    flashMessages: [],
  };
  function ourReducer(state, action) {
    switch (action.type) {
      case "loggedIn":
        return { loggedIn: true, flashMessages: state.flashMessages };
      case "loggedOut":
        return { loggedIn: false, flashMessages: state.flashMessages };
      case "flashMessages":
        return { loggedIn: state.loggedIn, flashMessages: state.flashMessages.concat(action.value) };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(ourReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <Header />
          <FlashMesaages messages={state.flashMessages} />
          <Routes>
            <Route path="/" exact element={state.loggedIn ? <LoggedInNoPosts /> : <GuestLogin />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/posts/:id" element={<ViewPosts />} />
            <Route path="/create-post" element={state.loggedIn ? <CreatePost /> : <GuestLogin />} />
          </Routes>
          <Footer />
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
