import React, { useContext } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedIn from "./HeaderLoggedIn/index.jsx";
import HeaderLoggedOut from "./HeaderLoggedOut/index.jsx";
import StateContext from "../../Context/StateContext";

function Header() {
  const globalState = useContext(StateContext);

  return (
    <>
      <header className="header-bar bg-primary mb-3">
        <div className="container d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <Link to="/" className="text-white">
              React Social Media
            </Link>
          </h4>
          {globalState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
        </div>
      </header>
    </>
  );
}

export default Header;
