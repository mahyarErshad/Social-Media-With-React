import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import DispatchContext from "../../../Context/DispatchContext";
import StateContext from "../../../Context/StateContext";
import Container from "../Container";
import FOF from "../FOF";
import Loading from "../Loading";

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
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCounts: 0,
    FOF: false,
  };
  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "fetchIsComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;

      case "changeTitle":
        draft.title.value = action.value;
        draft.title.hasError = false;
        return;
      case "changeBody":
        draft.body.value = action.value;
        draft.body.hasError = false;
        return;
      case "submitHandler":
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.sendCounts++;
        }
        return;
      case "changeIsSaving":
        draft.isSaving = !draft.isSaving;
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
      case "FOF":
        draft.FOF = true;
        return;

      default:
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(
    () => {
      const cancelRequest = axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await axios.get(`/post/${state.id}`, { cancelToken: cancelRequest.token });
          if (response.data.title) {
            dispatch({
              type: "fetchIsComplete",
              value: response.data,
            });
          } else {
            dispatch({
              type: "FOF",
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
      return () => {
        cancelRequest.cancel();
      };
    }, // eslint-disable-next-line
    [state.isFetching]
  );
  useEffect(
    () => {
      if (state.sendCounts > 0) {
        dispatch({ type: "changeIsSaving" });
        const cancelRequest = axios.CancelToken.source();
        async function fetchData() {
          try {
            await axios.post(
              `/post/${state.id}/edit`,
              {
                title: state.title.value,
                body: state.body.value,
                token: globalState.user.token,
              },
              { cancelToken: cancelRequest.token }
            );
            dispatch({ type: "changeIsSaving" });
            globalDispatch({ type: "flashMessages", value: "Post updated successfully!" });
            navigate(`/post/${state.id}`);
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

  if (state.FOF)
    return (
        <FOF />
    );
  if (state.isFetching)
    return (
      <Container title={"loading"}>
        <Loading />
      </Container>
    );
  return (
    <Container title={"Edit Post"}>
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back
      </Link>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={(e) => dispatch({ type: "blankTitle", value: e.target.value })} value={state.title.value} onChange={(e) => dispatch({ type: "changeTitle", value: e.target.value })} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasError && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={(e) => dispatch({ type: "blankBody", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} onChange={(e) => dispatch({ type: "changeBody", value: e.target.value })} />
          {state.body.hasError && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Updating" : "Update Post"}
        </button>
      </form>
    </Container>
  );
}

export default EditPost;
