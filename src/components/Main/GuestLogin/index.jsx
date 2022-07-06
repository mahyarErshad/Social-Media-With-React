import Axios from "axios";
import React, { useContext, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { useImmerReducer } from "use-immer";
import DispatchContext from "../../../Context/DispatchContext";
import Container from "../Container";

function Main() {
  const globalDispatch = useContext(DispatchContext);
  const nodeRef = useRef(null);
  const initialState = {
    username: {
      value: "",
      hasError: false,
      errorMessage: "",
      isUnique: false,
      checkCounts: 0,
    },
    email: {
      value: "",
      hasError: false,
      errorMessage: "",
      isUnique: false,
      checkCounts: 0,
    },
    password: {
      value: "",
      hasError: false,
      errorMessage: "",
    },
    counts: 0,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "usernameFast":
        draft.username.value = action.value;
        draft.username.hasError = false;
        if (draft.username.value.length > 30) {
          draft.username.hasError = true;
          draft.username.errorMessage = "Username must be less than 30 characters";
        }
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasError = true;
          draft.username.errorMessage = "Username must be alphanumeric";
        }
        return;
      case "usernameSlow":
        if (draft.username.value && draft.username.value.length < 3) {
          draft.username.hasError = true;
          draft.username.errorMessage = "Username must be at least 3 characters";
        }
        if (!draft.username.hasError && !action.noRequest) {
          draft.username.checkCounts++;
        }
        return;
      case "usernameUnique":
        if (action.value) {
          draft.username.isUnique = false;
          draft.username.hasError = true;
          draft.username.errorMessage = "Username is already taken";
        } else {
          draft.username.isUnique = true;
        }
        return;
      case "emailFast":
        draft.email.value = action.value;
        draft.email.hasError = false;
        return;
      case "emailSlow":
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(draft.email.value)) {
          draft.email.hasError = true;
          draft.email.errorMessage = "Email address is invalid";
        }
        if (!draft.email.hasError && !action.noRequest) {
          draft.email.checkCounts++;
        }
        return;
      case "emailUnique":
        if (action.value) {
          draft.email.isUnique = false;
          draft.email.hasError = true;
          draft.email.errorMessage = "Email address is already taken";
        } else {
          draft.email.isUnique = true;
        }
        return;
      case "passwordFast":
        draft.password.value = action.value;
        draft.password.hasError = false;
        if (draft.password.value.length > 50) {
          draft.password.hasError = true;
          draft.password.errorMessage = "Password must be less than 50 characters";
        }
        return;
      case "passwordSlow":
        if (draft.password.value && draft.password.value.length < 12) {
          draft.password.hasError = true;
          draft.password.errorMessage = "Password must be at least 12 characters";
        }
        return;
      case "submitForm":
        if (draft.username.isUnique && !draft.username.hasError && draft.email.isUnique && !draft.email.hasError && !draft.password.hasError) {
          draft.counts++;
        }
        return;
      default:
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);
  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "usernameSlow", value: state.username.value, noRequest: true });
    dispatch({ type: "usernameFast", value: state.username.value });
    dispatch({ type: "emailSlow", value: state.email.value, noRequest: true });
    dispatch({ type: "emailFast", value: state.email.value });
    dispatch({ type: "passwordSlow", value: state.password.value });
    dispatch({ type: "passwordFast", value: state.password.value });
    dispatch({ type: "submitForm" });
  }

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "usernameSlow" });
      }, 1000);
      return () => {
        clearTimeout(delay);
      };
    } // eslint-disable-next-line
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "emailSlow" });
      }, 1000);
      return () => {
        clearTimeout(delay);
      };
    } // eslint-disable-next-line
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "passwordSlow" });
      }, 1000);
      return () => {
        clearTimeout(delay);
      };
    } // eslint-disable-next-line
  }, [state.password.value]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    if (state.username.checkCounts > 0) {
      async function fetchData() {
        try {
          const response = await Axios.post("/doesUsernameExist", { username: state.username.value }, { cancelToken: ourRequest.token });
          dispatch({ type: "usernameUnique", value: response.data });
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    }

    return () => ourRequest.cancel(); // eslint-disable-next-line
  }, [state.username.checkCounts]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    if (state.email.checkCounts > 0) {
      async function fetchData() {
        try {
          const response = await Axios.post("/doesEmailExist", { email: state.email.value }, { cancelToken: ourRequest.token });
          dispatch({ type: "emailUnique", value: response.data });
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    }
    return () => ourRequest.cancel(); // eslint-disable-next-line
  }, [state.email.checkCounts]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    if (state.counts > 0) {
      async function fetchData() {
        try {
          const response = await Axios.post("/register", { email: state.email.value, username: state.username.value, password: state.password.value }, { cancelToken: ourRequest.token });
          globalDispatch({ type: "loggedIn", data: response.data });
          globalDispatch({ type: "flashMessages", value: "Congratulation! You have successfully created an account" });
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    }
    return () => ourRequest.cancel(); // eslint-disable-next-line
  }, [state.counts]);

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
              <CSSTransition nodeRef={nodeRef} in={state.username.hasError} timeout={500} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.username.errorMessage}</div>
              </CSSTransition>
              <input onChange={(e) => dispatch({ type: "usernameFast", value: e.target.value })} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <CSSTransition nodeRef={nodeRef} in={state.email.hasError} timeout={500} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.email.errorMessage}</div>
              </CSSTransition>
              <input onChange={(e) => dispatch({ type: "emailFast", value: e.target.value })} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <CSSTransition nodeRef={nodeRef} in={state.password.hasError} timeout={500} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.password.errorMessage}</div>
              </CSSTransition>
              <input onChange={(e) => dispatch({ type: "passwordFast", value: e.target.value })} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
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
