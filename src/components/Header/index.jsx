import React, { useContext } from "react";
import { Link } from "react-router-dom";
import MyContext from "../../MyContext.jsx";
import HeaderLoggedIn from "./HeaderLoggedIn/index.jsx";
import HeaderLoggedOut from "./HeaderLoggedOut/index.jsx";

function Header() {
  const { loggedIn } = useContext(MyContext);

  return (
    <>
      <header className="header-bar bg-primary mb-3">
        <div className="container d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <Link to="/" className="text-white">
              React Social Media
            </Link>
          </h4>
          {loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
        </div>
      </header>
    </>
  );
}

export default Header;
