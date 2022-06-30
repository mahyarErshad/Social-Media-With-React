import React, { useEffect } from "react";

//components
import Header from "./components/Header";
import Footer from "./components/Footer";
import GuestLogin from "./components/main/GuestLogin/index.jsx";
import About from "./components/main/About/index.jsx";
import Terms from "./components/main/Terms/index.jsx";
import Profile from "./components/main/Profile/index.jsx";
import CreatePost from "./components/main/CreatePost/index.jsx";
import LoggedInNoPosts from "./components/main/LoggedInNoPosts/index.jsx";
import ViewPosts from "./components/main/ViewPosts";
import EditPost from "./components/main/EditPost";

//contexts
import DispatchContext from "./Context/DispatchContext";
import StateContext from "./Context/StateContext";

//utils
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Axios from "axios";
import FlashMesaages from "./components/FlashMesaages/FlashMesaages";
import { useImmerReducer } from "use-immer";
import FOF from "./components/main/FOF";
import Search from "./components/Header/Search";
import { CSSTransition } from "react-transition-group";
Axios.defaults.baseURL = "http://localhost:8080";

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("socialMediatoken")),
    flashMessages: [],
    user: {
      username: localStorage.getItem("socialMediaUsername"),
      avatar: localStorage.getItem("socialMediaAvatar"),
      token: localStorage.getItem("socialMediatoken"),
    },
    isSearching: false,
  };
  function ourReducer(draft, action) {
    switch (action.type) {
      case "loggedIn":
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case "loggedOut":
        draft.loggedIn = false;
        return;
      case "flashMessages":
        draft.flashMessages.push(action.value);
        return;
      case "searching":
        draft.isSearching = !draft.isSearching;
        return;
      default:
        return state;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("socialMediaUsername", state.user.username);
      localStorage.setItem("socialMediaAvatar", state.user.avatar);
      localStorage.setItem("socialMediatoken", state.user.token);
    } else {
      localStorage.removeItem("socialMediaUsername");
      localStorage.removeItem("socialMediaAvatar");
      localStorage.removeItem("socialMediatoken");
    } // eslint-disable-next-line
  }, [state.loggedIn]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <Header />
          <FlashMesaages messages={state.flashMessages} />
          <Routes>
            <Route path="/" element={state.loggedIn ? <LoggedInNoPosts /> : <GuestLogin />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/post/:id" element={<ViewPosts />} />
            <Route path="/post/:id/edit" element={state.loggedIn ? <EditPost /> : <GuestLogin />} />
            <Route path="/create-post" element={state.loggedIn ? <CreatePost /> : <GuestLogin />} />
            <Route path="*" element={<FOF />} />
          </Routes>
          <CSSTransition timeout={500} in={state.isSearching} classNames={"search-overlay"} unmountOnExit>
            <Search />
          </CSSTransition>
          <Footer />
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
