import Axios from "axios";
import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import DispatchContext from "../../../Context/DispatchContext";
import ShowSearch from "./ShowSearch";

function Search() {
  const globalDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    terms: "",
    results: [],
    showing: "neither",
    requestCounts: 0,
  });
  function handleSearch(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.terms = value;
    });
  }
  useEffect(() => {
    if (state.terms.trim()) {
      setState((draft) => {
        draft.showing = "loading";
      });
      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCounts++;
        });
      }, 1000);

      return () => clearTimeout(delay);
    } else {
      setState((draft) => {
        draft.showing = "neither";
      });
    } // eslint-disable-next-line
  }, [state.terms]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    if (state.requestCounts > 0) {
      async function fetchData() {
        try {
          const response = await Axios.post("/search", { searchTerm: state.terms }, { cancelToken: ourRequest.token });
          setState((draft) => {
            draft.results = response.data;
            draft.showing = "results";
          });
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    }

    return () => ourRequest.cancel(); // eslint-disable-next-line
  }, [state.requestCounts]);

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handleSearch} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you looking for?" />
          <span onClick={() => globalDispatch({ type: "searching" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"circle-loader " + (state.showing === "loading" ? "circle-loader--visible" : "")}></div>
          <div className={"live-search-results " + (state.showing === "results" ? "live-search-results--visible" : "")}>
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length} {state.results.length > 1 ? "items" : "item"} found)
                </div>
                {state.results.map((post) => {
                  return <ShowSearch post={post} key={post._id} />;
                })}
              </div>
            )}
            {Boolean(!state.results.length) && (
              <p className="shadow-sm text-center alert alert-danger">
                Sorry! There are no matching results for <strong>{`"${state.terms}"`}</strong>{" "}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
