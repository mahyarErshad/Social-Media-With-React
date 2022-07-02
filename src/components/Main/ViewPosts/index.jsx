import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import Container from "../Container";
import Loading from "../Loading";
import FOF from "../FOF";
import StateContext from "../../../Context/StateContext";
import DispatchContext from "../../../Context/DispatchContext";

function ViewPosts() {
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [post, setPost] = useState([]);
  const { id } = useParams();

  const globalState = React.useContext(StateContext);
  const globalDispatch = React.useContext(DispatchContext);
  const navigate = useNavigate();

  useEffect(
    () => {
      const cancelRequest = axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await axios.get(`/post/${id}`, { cancelToken: cancelRequest.token });
          if (response.data) {
            setIsLoading(false);
            setPost(response.data);
          } else {
            setNotFound(true);
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
    [isLoading , id]
  );

  if (notFound) return <FOF />;
  if (isLoading)
    return (
      <Container title={"loading"}>
        <Loading />
      </Container>
    );
  const date = new Date(post.createdDate);
  const formattedDate = ` ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  function handleBtn() {
    if (globalState.user.username === post.author.username && globalState.loggedIn) {
      return true;
    } else {
      return false;
    }
  }
  async function deleteHandler() {
    const userConfirmation = window.confirm("Are you sure you want to delete this post?");
    if (userConfirmation) {
      try {
        const response = await axios.delete(`/post/${id}`, { data: { token: globalState.user.token } });
        if (response.data === "Success") {
          globalDispatch({ type: "flashMessages", value: "Post has been deleted successfully" });
          navigate(`/profile/${globalState.user.username}`);
        } else {
          globalDispatch({ type: "flashMessages", value: "Something went wrong. Please try again." });
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      return;
    }
  }

  return (
    <Container title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          {handleBtn() && (
            <>
              <Link to={`/post/${id}/edit`} data-tip="Edit the post" data-for="edit" className="text-primary mr-2">
                <i className="fas fa-edit"></i>
              </Link>
              <ReactTooltip id="edit" className="custom-tooltip" />
              <button onClick={deleteHandler} data-tip="Delete the post" data-for="delete" className="delete-post-button text-danger">
                <i className="fas fa-trash"></i>
              </button>
              <ReactTooltip id="delete" className="custom-tooltip" />
            </>
          )}
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} alt="avatar" />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> {formattedDate}
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.body} />
      </div>
    </Container>
  );
}

export default ViewPosts;
