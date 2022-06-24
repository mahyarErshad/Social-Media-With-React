import React, { useContext, useState } from "react";
import Container from "../Container/";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MyContext from "../../../MyContext";

function CreatePost() {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const navigate = useNavigate();
  const {addFlashMessages} = useContext(MyContext);

  function handleSubmit(e) {
    e.preventDefault();
    try {
      axios.post("/create-post", {
        title,
        body,
        token: localStorage.getItem("socialMediatoken"),
      }).then((newPost) => {
      addFlashMessages("You have successfully created a post!");
      // console.log(newPost);
      navigate(`/posts/${newPost.data}`);})
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Container title={"Create New Post"}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={(e) => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={(e) => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Container>
  );
}

export default CreatePost;
