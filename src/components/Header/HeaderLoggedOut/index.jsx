import axios from "axios";
import React, { useContext, useState } from "react";
import DispatchContext from "../../../Context/DispatchContext";

function HeaderLoggedOut() {
  const globalDispatch = useContext(DispatchContext);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/login", {
        username,
        password,
      });
      if (response.data) {
        globalDispatch({ type: "loggedIn", data: response.data });
        globalDispatch({ type: "flashMessages", value: `Welcome back ${username}` });
      } else {
        globalDispatch({ type: "flashMessages", value: "Invalid username/password" });
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
          <button className="btn btn-dark btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
}

export default HeaderLoggedOut;
