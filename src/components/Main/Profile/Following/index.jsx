import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../Loading";
import Container from "../../Container";

function Following() {
  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState([]);
  const { username } = useParams();

  useEffect(
    () => {
      const ourRequest = axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await axios.get(`/profile/${username}/following`, { cancelToken: ourRequest.token });
          setIsLoading(false);
          setFollowing(response.data);
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
      <Container title={"loading"}>
        <Loading />
      </Container>
    );

  return (
    <div className="list-group">
      {following.length ? (
        following.map((follower, index) => {
          return (
            <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
              <img className="avatar-tiny" src={follower.avatar} alt="avatar" /> {`\t`} <strong>{follower.username}</strong>
            </Link>
          );
        })
      ) : (
        <div className="text-center alert alert-warning">
          <strong>{`"${username}" `}</strong>
          <span>is not following anyone!</span>
        </div>
      )}
    </div>
  );
}

export default Following;
