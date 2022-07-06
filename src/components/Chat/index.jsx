import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { useImmer } from "use-immer";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";
const socket = io("http://localhost:8080");

function Chat() {
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const globalState = useContext(StateContext);
  const globalDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    value: "",
    messages: [],
  });

  useEffect(() => {
    if (globalState.isChatOpen) {
      chatField.current.focus();
      globalDispatch({ type: "unreadChatReset" });
    }
    // eslint-disable-next-line
  }, [globalState.isChatOpen]);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (state.messages.length && !globalState.isChatOpen) {
      globalDispatch({ type: "unreadChatIncreament" });
    }
     // eslint-disable-next-line
  }, [state.messages]);

  useEffect(() => {
    try {
      socket.on("chatFromServer", (message) => {
        setState((draft) => {
          draft.messages.push(message);
        });
      });
    } catch (e) {
      console.log("Could not connect to chat server...");
    } // eslint-disable-next-line
  }, []);

  function handleInputChange(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.value = value;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (state.value) {
      try {
        socket.emit("chatFromBrowser", { message: state.value, token: globalState.user.token });
      } catch (e) {
        console.log("Could not connect to chat server...");
      }
      setState((draft) => {
        draft.messages.push({ value: draft.value, username: globalState.user.username, avatar: globalState.user.avatar });
        draft.value = "";
      });
    }
  }
  return (
    <div id="chat-wrapper" className={"chat-wrapper shadow border-top border-left border-right " + (globalState.isChatOpen && "chat-wrapper--is-visible")}>
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => globalDispatch({ type: "closeChat" })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.messages.map((message, index) => {
          if (globalState.user.username === message.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.value}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} alt="" />
              </div>
            );
          } else {
            return (
              <div key={index} className="chat-other">
                <Link to={`/profile/${message.username}`}>
                  <img className="avatar-tiny" src={message.avatar} alt="" />
                </Link>
                <div className="chat-message">
                  <div className="chat-message-inner">
                    <Link to={`/profile/${message.username}`}>
                      <strong>{message.username}:</strong>
                      {`\t`}
                    </Link>
                    {message.message}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
      <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
        <input value={state.value} ref={chatField} onChange={handleInputChange} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>
    </div>
  );
}

export default Chat;
