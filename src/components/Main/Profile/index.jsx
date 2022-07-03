import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import Container from "../Container/index.jsx";
import StateContext from "../../../Context/StateContext";
import FOF from "../FOF/index.jsx";
import { useImmer } from "use-immer";

function Profile() {
  const { username } = useParams();
  const globalState = useContext(StateContext);
  const [notFound, setNotFound] = useState(false);
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "loading...",
      profileAvatar: " ",
      isFollowing: false,
      counts: { postCount: 0, followerCount: 0, followingCount: 0 },
    },
  });

  useEffect(
    () => {
      const ourRequest = axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await axios.post(`/profile/${username}`, { token: globalState.user.token }, { cancelToken: ourRequest.token });
          if (response.data) {
            setState((draft) => {
              draft.profileData = response.data;
            });
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

  useEffect(
    () => {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const ourRequest = axios.CancelToken.source();
      if (state.startFollowingRequestCount) {
        async function fetchData() {
          try {
            const response = await axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: globalState.user.token }, { cancelToken: ourRequest.token });
            if (response.data) {
              setState((draft) => {
                draft.profileData.isFollowing = true;
                draft.profileData.counts.followerCount++;
                draft.followActionLoading = false;
              });
              setNotFound(false);
            } else {
              setNotFound(true);
              setState((draft) => {
                draft.followActionLoading = false;
              });
            }
          } catch (e) {
            console.log(e);
          }
        }
        fetchData();
        return () => {
          ourRequest.cancel();
        };
      }
    }, // eslint-disable-next-line
    [state.startFollowingRequestCount]
  );

  useEffect(
    () => {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const ourRequest = axios.CancelToken.source();
      if (state.stopFollowingRequestCount) {
        async function fetchData() {
          try {
            const response = await axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: globalState.user.token }, { cancelToken: ourRequest.token });
            if (response.data) {
              setState((draft) => {
                draft.profileData.isFollowing = false;
                draft.profileData.counts.followerCount--;
                draft.followActionLoading = false;
              });
              setNotFound(false);
            } else {
              setNotFound(true);
              setState((draft) => {
                draft.followActionLoading = false;
              });
            }
          } catch (e) {
            console.log(e);
          }
        }
        fetchData();
        return () => {
          ourRequest.cancel();
        };
      }
    }, // eslint-disable-next-line
    [state.stopFollowingRequestCount]
  );

  function followUser() {
    setState((draft) => {
      draft.startFollowingRequestCount++;
    });
  }
  function unfollowUser() {
    setState((draft) => {
      draft.stopFollowingRequestCount++;
    });
  }

  if (notFound) {
    return <FOF />;
  } else {
    return (
      <>
        <Container title={`${username}`}>
          <h2>
            <img className="avatar-small" src={state.profileData.profileAvatar} alt=" " /> {state.profileData.profileUsername}
            {globalState.loggedIn && globalState.user.username !== state.profileData.profileUsername && !state.profileData.isFollowing && state.profileData.profileUsername !== "loading..." ? (
              <button onClick={followUser} className="btn btn-primary btn-sm ml-2">
                Follow <i className="fas fa-user-plus"></i>
              </button>
            ) : (
              ""
            )}
            {globalState.loggedIn && globalState.user.username !== state.profileData.profileUsername && state.profileData.isFollowing && state.profileData.profileUsername !== "loading..." ? (
              <button onClick={unfollowUser} className="btn btn-danger btn-sm ml-2">
                unfollow <i className="fas fa-user-times"></i>
              </button>
            ) : (
              ""
            )}
          </h2>

          <div className="profile-nav nav nav-tabs pt-2 mb-4">
            <NavLink to={`/profile/${state.profileData.profileUsername}`} className="nav-item nav-link" end>
              Posts: {state.profileData.counts.postCount}
            </NavLink>
            <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
              Followers: {state.profileData.counts.followerCount}
            </NavLink>
            <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
              Following: {state.profileData.counts.followingCount}
            </NavLink>
          </div>
          <Outlet />
        </Container>
      </>
    );
  }
}

export default Profile;
