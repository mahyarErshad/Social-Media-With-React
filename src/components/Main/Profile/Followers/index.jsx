import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../Loading";
import Container from "../../Container";

function Followers(props) {
  const action = props.type.action;
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const { username } = useParams();

  useEffect(
    () => {
      setIsLoading(true);
      const ourRequest = axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await axios.get(`/profile/${username}/${action}`, { cancelToken: ourRequest.token });
          setIsLoading(false);
          setFollowers(response.data);
        } catch (e) {
          setIsLoading(false);
          console.log(e);
        }
      }
      fetchData();
      return () => {
        ourRequest.cancel();
      };
    }, // eslint-disable-next-line
    [isLoading, username, action]
  );

  if (isLoading)
    return (
      <Container title={username}>
        <Loading />
      </Container>
    );

  return (
    <div className="list-group">
      {followers.length ? (
        followers.map((follower, index) => {
          return (
            <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
              <img className="avatar-tiny" src={follower.avatar} alt="avatar" /> {`\t`} <strong>{follower.username}</strong>
            </Link>
          );
        })
      ) : (
        <div className="text-center alert alert-warning">
          <strong>{`"${username}" `}</strong>
          <span>{action === "followers" ? "has no followers!" : "is not following anybody!"}</span>
        </div>
      )}
    </div>
  );
}

export default Followers;
