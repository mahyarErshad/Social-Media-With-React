import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../Loading";
import Container from "../../Container";
import ShowSearch from "../../../Header/Search/ShowSearch";

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
    [isLoading, username]
  );

  if (isLoading)
    return (
      <Container title={username}>
        <Loading />
      </Container>
    );

  return (
    <div className="list-group">
      {posts.length ? (
        posts.map((post) => {
          return <ShowSearch post={post} key={post._id} noAuther={true} />;
        })
      ) : (
        <div className="text-center alert alert-warning">
          <strong>{`"${username}" `}</strong>has not posted anything yet!
        </div>
      )}
    </div>
  );
}

export default ProfilePosts;
