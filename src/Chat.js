import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import ChatMessage from "./ChatMessage";
import firebase from "firebase";
import { db } from "./firebase";

function Chat(props) {
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const endOfChat = useRef();

  useEffect(() => {
    let unsubscribe;
    if (props.teamId) {
      unsubscribe = db
        .collection("teams")
        .doc(props.teamId)
        .collection("chat")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setChatMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [props.teamId]);

  useEffect(() => {
    scrollDown();
  }, [chatMessages]);

  const sendMessage = (e) => {
    e.preventDefault();
    let newMessage = db
      .collection("teams")
      .doc(props.teamId)
      .collection("chat")
      .doc();
    newMessage.set({
      player_name: props.playerName,
      message_text: chatMessage,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setChatMessage("");
  };

  function scrollDown() {
    endOfChat.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="chat">
      <h2>CHAT</h2>
      <div className="chat__window">
        {chatMessages.map((message) => (
          <ChatMessage
            key={message.timestamp}
            playerName={message.player_name}
            chatMessage={message.message_text}
          />
        ))}
        <div ref={endOfChat} align="left"></div>
      </div>
      <div className="chat_inputContainer">
        <form className="chat__form">
          <input
            className="chat__input"
            placeholder="Write a message..."
            type="text"
            value={chatMessage}
            autoFocus
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <button type="submit" onClick={sendMessage}>
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
