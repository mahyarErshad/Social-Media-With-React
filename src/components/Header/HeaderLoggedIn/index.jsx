import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "../../../Context/DispatchContext";
import StateContext from "../../../Context/StateContext";

function HeaderLoggedIn() {
  const globalDispatch = useContext(DispatchContext);
  const globalState = useContext(StateContext);
  function handleSignOut() {
    globalDispatch({ type: "flashMessages", value: `We will be waiting for you ${globalState.user.username}!` });
    globalDispatch({ type: "closeChat" });
    globalDispatch({ type: "loggedOut" });
  }
  function handleSearch(e) {
    e.preventDefault();
    globalDispatch({ type: "searching" });
  }
  return (
    <div className="flex-row my-3 my-md-0">
      <a onClick={handleSearch} href="#http://localhost:3000/" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      {`\t`}
      <span onClick={() => globalDispatch({ type: "toggleChat" })} className={"mr-2 header-chat-icon " + (globalState.unreadChatCounter ? "text-danger" : "text-white")}>
        <i className="fas fa-comment"></i>
        {globalState.unreadChatCounter > 0 && globalState.unreadChatCounter <= 10 ? <span className="chat-count-badge text-white">{globalState.unreadChatCounter}</span> : ""}
        {globalState.unreadChatCounter > 0 && globalState.unreadChatCounter > 10 ? <span className="chat-count-badge text-white">+10</span> : ""}
      </span>
      {`\t`}
      <Link to={`/profile/${globalState.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={globalState.user.avatar} alt={"avatar"} />
      </Link>
      {`\t`}
      <Link className="btn btn-sm btn-dark mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleSignOut} className="btn btn-sm btn-danger">
        Sign Out
      </button>
    </div>
  );
}

export default HeaderLoggedIn;
