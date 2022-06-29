import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import Container from "../Container";
import Loading from "../Loading";
import FOF from "../FOF";

function ViewPosts() {
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [post, setPost] = useState([]);
  const { id } = useParams();

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
    [isLoading]
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
  return (
    <Container title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <Link to={`/post/${id}/edit`} data-tip="Edit the post" data-for="edit" className="text-primary mr-2">
            <i className="fas fa-edit"></i>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />
          <a href="http://localhost:3000/" data-tip="Delete the post" data-for="delete" className="delete-post-button text-danger">
            <i className="fas fa-trash"></i>
          </a>
          <ReactTooltip id="delete" className="custom-tooltip" />
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
