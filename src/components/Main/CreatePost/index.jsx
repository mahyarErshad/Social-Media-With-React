import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import DispatchContext from "../../../Context/DispatchContext";
import StateContext from "../../../Context/StateContext";
import Container from "../Container";

function EditPost() {
  const globalState = useContext(StateContext);
  const globalDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const initialState = {
    title: {
      value: "",
      hasError: false,
      message: "",
    },
    body: {
      value: "",
      hasError: false,
      message: "",
    },
    submitting: false,
    sendCounts: 0,
  };
  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "setTitle":
        draft.title.value = action.value;
        draft.title.hasError = false;
        return;
      case "setBody":
        draft.body.value = action.value;
        draft.body.hasError = false;
        return;
      case "submitHandler":
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.sendCounts++;
        }
        return;
      case "submitting":
        draft.submitting = !draft.submitting;
        return;
      case "blankTitle":
        if (!action.value.trim()) {
          draft.title.hasError = true;
          draft.title.message = "Title is required";
        }
        return;
      case "blankBody":
        if (!action.value.trim()) {
          draft.body.hasError = true;
          draft.body.message = "You must write something";
        }
        return;

      default:
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(
    () => {
      if (state.sendCounts > 0) {
        dispatch({ type: "submitting" });
        const cancelRequest = axios.CancelToken.source();
        async function fetchData() {
          try {
            await axios
              .post("/create-post", {
                title: state.title.value,
                body: state.body.value,
                token: globalState.user.token,
              })
              .then((newPost) => {
                dispatch({ type: "submitting" });
                globalDispatch({ type: "flashMessages", value: "You have successfully created a post" });
                // console.log(newPost);
                navigate(`/post/${newPost.data}`);
              });
          } catch (e) {
            console.log(e);
          }
        }
        fetchData();
        return () => {
          cancelRequest.cancel();
        };
      }
    }, // eslint-disable-next-line
    [state.sendCounts]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "blankTitle", value: state.title.value });
    dispatch({ type: "blankBody", value: state.body.value });
    dispatch({ type: "submitHandler" });
  };

  return (
    <Container title={"Create Post"}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={(e) => dispatch({ type: "blankTitle", value: e.target.value })} value={state.title.value} onChange={(e) => dispatch({ type: "setTitle", value: e.target.value })} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasError && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={(e) => dispatch({ type: "blankBody", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} onChange={(e) => dispatch({ type: "setBody", value: e.target.value })} />
          {state.body.hasError && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.submitting}>
          {state.submitting ? "..." : "Create Post"}
        </button>
      </form>
    </Container>
  );
}

export default EditPost;
