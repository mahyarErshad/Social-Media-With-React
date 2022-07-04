import React, { useContext, useEffect } from "react";
import Container from "../Container";
import StateContext from "../../../Context/StateContext";
import DispatchContext from "../../../Context/DispatchContext";
import { useImmer } from "use-immer";
import axios from "axios";
import Loading from "../Loading";
import ShowSearch from "../../Header/Search/ShowSearch";

function LoggedIn() {
  const globalState = useContext(StateContext);
  const globalDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    loading: true,
    feed: [],
  });

  useEffect(
    () => {
      const ourRequest = axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await axios.post(`/getHomeFeed`, { token: globalState.user.token }, { cancelToken: ourRequest.token });
          if (response.data) {
            setState((draft) => {
              draft.feed = response.data;
              draft.loading = false;
            });
          } else {
            setState((draft) => {
              draft.loading = false;
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
    }, // eslint-disable-next-line
    []
  );
  if (state.loading) {
    return <Loading />;
  } else {
    return (
      <Container title={"Welcome"}>
        {state.feed.length === 0 && (
          <>
            <h2 className="text-center">
              Hello <strong>{globalState.user.username}</strong>, your feed is empty.
            </h2>
            <p className="lead text-muted text-center">
              Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay. you can use the{" "}
              <span style={{ cursor: "pointer" }} onClick={() => globalDispatch({ type: "searching" })}>
                &ldquo;Search&rdquo;
              </span>{" "}
              feature in the top menu bar to find content written by people with similar interests and then follow them.
            </p>
          </>
        )}
        {state.feed.length > 0 && (
          <>
            <h2 className="text-center mb-4">Latest posts from people you follow</h2>
            <div className="list-group"></div>
            {state.feed.map((post) => {
              return <ShowSearch post={post} key={post._id} />;
            })}
          </>
        )}
      </Container>
    );
  }
}

export default LoggedIn;
