import React, { useContext } from "react";
import { Link } from "react-router-dom";
import MyContext from "../../../MyContext";

function HeaderLoggedIn() {
  const { setLoggedIn } = useContext(MyContext);
  function handleSignOut() {
    setLoggedIn(false);
    localStorage.removeItem("socialMediaUsername");
    localStorage.removeItem("socialMediaAvatar");
    localStorage.removeItem("socialMediatoken");
  }
  return (
    <div className="flex-row my-3 my-md-0">
      <a href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <a href="#" className="mr-2">
        <img className="small-header-avatar" src={localStorage.getItem("socialMediaAvatar")} />
      </a>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleSignOut} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
}

export default HeaderLoggedIn;
