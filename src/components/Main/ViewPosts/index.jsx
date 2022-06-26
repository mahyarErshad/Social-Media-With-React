import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "../Container";
import Loading from "../Loading"

function ViewPosts() {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState([]);
  const { id } = useParams();

  useEffect(
    () => {
      async function fetchData() {
        try {
          const response = await axios.get(`/post/${id}`);
          setIsLoading(false);
          setPost(response.data);
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    }, // eslint-disable-next-line
    [isLoading]
  );

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
          <a href="http://localhost:3000/" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a href="http://localhost:3000/" className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} alt="avatar" />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> {formattedDate}
      </p>

      <div className="body-content">{post.body}</div>
    </Container>
  );
}

export default ViewPosts;
