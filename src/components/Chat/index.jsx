import React, { useContext, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import DispatchContext from "../../Context/DispatchContext";
import StateContext from "../../Context/StateContext";

function Chat() {
  const chatField = useRef(null);
  const globalState = useContext(StateContext);
  const globalDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    value: "",
    messages: [],
  });

  useEffect(() => {
    if (globalState.isChatOpen) {
      chatField.current.focus();
    }
  }, [globalState.isChatOpen]);

  function handleInputChange(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.value = value;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (state.value) {
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
      <div id="chat" className="chat-log">
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
            <div className="chat-other">
              <a href="#">
                <img className="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128" alt="" />
              </a>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <a href="#">
                    <strong>barksalot:</strong>
                  </a>
                  Hey, I am good, how about you?
                </div>
              </div>
            </div>;
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
