import React from "react";

function ChatMessage(props) {
  return (
    <div>
      <div className="chat__message">
        <b>{props.playerName}: </b> {props.chatMessage}
      </div>
    </div>
  );
}

export default ChatMessage;
