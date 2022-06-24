import axios from "axios";
import React, { useContext, useState } from "react";
import MyContext from "../../../MyContext";

function HeaderLoggedOut() {
  const { setLoggedIn } = useContext(MyContext);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/login", {
        username,
        password,
      });
      if (response.data) {
        setLoggedIn(true);
        // console.log(response.data)
        localStorage.setItem("socialMediaUsername", response.data.username);
        localStorage.setItem("socialMediaAvatar", response.data.avatar);
        localStorage.setItem("socialMediatoken", response.data.token);
      } else {
        console.log("invalid username or password");
      }
    } catch (e) {
      console.error(e);
    }
  }
  const [username, setUsername] = useState();
  const [password, setpassword] = useState();
  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={(e) => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={(e) => setpassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
}

export default HeaderLoggedOut;
