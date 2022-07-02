import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "../../../../Context/DispatchContext";

function ShowSearch({ post }) {
  const globalDispatch = useContext(DispatchContext);
  const date = new Date(post.createdDate);
  const formattedDate = ` ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  return (
    <div className="list-group">
      <Link onClick={() => globalDispatch({ type: "searching" })} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
        <img className="avatar-tiny" src={post.author.avatar} alt="avatar" /> <strong>{post.title}</strong> {`\t`}
        <span className="text-muted small">{`on ${formattedDate} by ${post.author.username}`}</span>
      </Link>
    </div>
  );
}

export default ShowSearch;
