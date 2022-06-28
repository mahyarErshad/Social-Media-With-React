import React from "react";
import { Link } from "react-router-dom";
import Container from "../Container";

function FOF() {
  return (
    <Container title="404 - Not found">
      <div className="text-center">
        <h2>404 - Not found</h2>
        <p className="lead text-muted">
          There's nothing to show here. Click <Link to="/">here</Link> to go homepage.
        </p>
      </div>
    </Container>
  );
}

export default FOF;
