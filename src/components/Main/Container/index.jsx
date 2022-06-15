import React, { useEffect } from "react";

function Container(props) {
  useEffect(() => {
    document.title = props.title;
    window.scrollTo(0, 0);
  });
  return <div className={"container py-md-5 " + (props.wide ? "" : "container--narrow")}>{props.children}</div>;
}

export default Container;
