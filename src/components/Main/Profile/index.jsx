import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../Container/index.jsx";
import StateContext from "../../../Context/StateContext";
import ProfilePosts from "./ProfilePosts/index.jsx";
import FOF from "../FOF/index.jsx";

function Profile() {
  const { username } = useParams();
  const globalState = useContext(StateContext);
  const [notFound, setNotFound] = useState(false);
  const [profileData, setProfileData] = useState({
    profileUsername: " ",
    profileAvatar: " ",
    isFollowing: false,
    counts: { postCount: 0, followerCount: 0, followingCount: 0 },
  });

  useEffect(
    () => {
      const ourRequest = axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await axios.post(`/profile/${username}`, { token: globalState.user.token }, { cancelToken: ourRequest.token });
          if (response.data) {
            setProfileData(response.data);
            setNotFound(false);
          } else {
            setNotFound(true);
          }
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
      return () => {
        ourRequest.cancel();
      };
    }, // eslint-disable-next-line
    [username]
  );

  if (notFound) {
    return <FOF />;
  } else {
    return (
      <>
        <Container title={"profile"}>
          <h2>
            <img className="avatar-small" src={globalState.user.avatar} alt="avatar" /> {profileData.profileUsername}
            <button className="btn btn-primary btn-sm ml-2">
              Follow <i className="fas fa-user-plus"></i>
            </button>
          </h2>

          <div className="profile-nav nav nav-tabs pt-2 mb-4">
            <a href="http://localhost:3000/" className="active nav-item nav-link">
              Posts: {profileData.counts.postCount}
            </a>
            <a href="http://localhost:3000/" className="nav-item nav-link">
              Followers: {profileData.counts.followerCount}
            </a>
            <a href="http://localhost:3000/" className="nav-item nav-link">
              Following: {profileData.counts.followingCount}
            </a>
          </div>

          <ProfilePosts />
        </Container>
      </>
    );
  }
}

export default Profile;
