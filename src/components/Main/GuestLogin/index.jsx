import React, { useContext, useState } from "react";
import Container from "../Container";
import Axios from "axios";
import DispatchContext from "../../../Context/DispatchContext";

function Main() {
  const globalDispatch = useContext(DispatchContext);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await Axios.post("/register", { username: userName, email, password });
      globalDispatch({ type: "flashMessages", value: "User created successfully!" });
      setUserName("");
      setEmail("");
      setPassword("");
    } catch (e) {
      console.log(e.response.data);
    }
  }

  const [userName, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  return (
    <Container wide={true} title={"Social Media"}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Not a member yet?</h1>
          <p className="lead text-muted">You can create an account easily to start posting new content and follow people to make friends.</p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input value={userName} onChange={(e) => setUserName(e.target.value)} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-dark btn-block">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}

export default Main;
