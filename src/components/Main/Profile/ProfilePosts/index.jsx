import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../Loading";
import Container from "../../Container";

function ProfilePosts() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(
    () => {
      const ourRequest = axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token });
          setIsLoading(false);
          setPosts(response.data);
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
      return () => {
        ourRequest.cancel();
      };
    }, // eslint-disable-next-line
    [isLoading , username]
  );

  if (isLoading)
    return (
      <Container title={"loading"}>
        <Loading />
      </Container>
    );

  return (
    <div className="list-group">
      {posts.map((post) => {
        const date = new Date(post.createdDate);
        const formattedDate = ` ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return (
          <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={post.author.avatar} alt="avatar" /> <strong>{post.title}</strong> {`\t`}
            <span className="text-muted small">on {formattedDate} </span>
          </Link>
        );
      })}
    </div>
  );
}

export default ProfilePosts;
