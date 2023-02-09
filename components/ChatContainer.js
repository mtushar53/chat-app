import {
  getAllMessagesRoute,
  logoutRoute,
  sendMessageRoute,
} from "@/utils/APIRoutes";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function ChatContainer({ currentChat, socket, currentUser, isLoaded }) {
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [typingUserId, setTypingUserId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (currentChat) {
        const response = await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
    };
    fetchData();
  }, [currentChat]);

  const handleLogout = async () => {
    const response = await axios.post(logoutRoute, { id: currentUser._id });
    if (response.status == 200) {
      localStorage.removeItem("chat-app-user");
      router.push("/login");
    }
  };

  const handleSendMsg = async () => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.unshift({
      fromSelf: true,
      message: msg,
    });
    setMessages(msgs);
    setMsg("");
  };

  useEffect(() => {
    console.log(socket, "front socket");
    if (socket.current) {
      socket.current.on("msg-recieved", (msg) => {
        console.log(msg, "message received");
        setArrivalMessage({
          fromSelf: false,
          message: msg,
        });
      });

      socket.current.on("is-typing", (value) => {
        console.log(value, "is-typing");
        console.log(currentChat, "is-chat");
        setTypingUserId(value);
      });
    }
  }, [socket.current]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [arrivalMessage, ...prev]);
  }, [arrivalMessage]);

  let typing = false;
  let timeout = undefined;

  function timeoutFunction() {
    typing = false;
    socket.current.emit("not-typing", {
      to: currentChat._id,
      from: currentUser._id,
    });
  }

  function onKeyDownNotEnter() {
    if (typing == false) {
      typing = true;
      socket.current.emit("typing", {
        to: currentChat._id,
        from: currentUser._id,
      });
      timeout = setTimeout(timeoutFunction, 3000);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(timeoutFunction, 3000);
    }
  }

  return (
    <div className="w-4/6 bg-[#fafaff] relative">
      <div className="bg-white px-3 py-1 shadow-sm flex items-center justify-between">
        <div className="flex items-center">
          <Image
            className="rounded-full"
            src="/assets/avatar.png"
            alt="avatar"
            width={32}
            height={32}
          />
          <h2 className="ml-3">
            {currentChat ? currentChat.name : "Messenger"}
          </h2>
        </div>
        <button onClick={handleLogout} title="Logout">
          <svg
            className="svg-inline--fa fa-sign-out-alt fa-w-16 text-[#2180f3]"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="sign-out-alt"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"
            ></path>
          </svg>
        </button>
      </div>
      {isLoaded && currentChat == undefined ? (
        <h2 className="text-center mt-40 text-gray-400">
          Please select a chat to start messaging
        </h2>
      ) : (
        <>
          <div className="chats-container">
            {typingUserId == currentChat?._id ? (
              <div className="typing-content">
                <span class="dot one"></span>
                <span class="dot two"></span>
                <span class="dot three"></span>
              </div>
            ) : null}
            {messages.map((message, index) => {
              return (
                <div key={index}>
                  <div
                    className={`message ${
                      message.fromSelf ? "sended" : "recieved"
                    }`}
                  >
                    <div className="content flex">
                      <p>{message.message}</p>
                      <sub
                        title="Aug 31st 22, 10:25:47 PM"
                        className="message-time flex items-center"
                      >
                        <svg
                          className="svg-inline--fa fa-check-double fa-w-16 seen"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="check-double"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          data-fa-i2svg=""
                        >
                          <path
                            fill="currentColor"
                            d="M505 174.8l-39.6-39.6c-9.4-9.4-24.6-9.4-33.9 0L192 374.7 80.6 263.2c-9.4-9.4-24.6-9.4-33.9 0L7 302.9c-9.4 9.4-9.4 24.6 0 34L175 505c9.4 9.4 24.6 9.4 33.9 0l296-296.2c9.4-9.5 9.4-24.7.1-34zm-324.3 106c6.2 6.3 16.4 6.3 22.6 0l208-208.2c6.2-6.3 6.2-16.4 0-22.6L366.1 4.7c-6.2-6.3-16.4-6.3-22.6 0L192 156.2l-55.4-55.5c-6.2-6.3-16.4-6.3-22.6 0L68.7 146c-6.2 6.3-6.2 16.4 0 22.6l112 112.2z"
                          ></path>
                        </svg>
                        {moment(message.createdAt).fromNow()}
                      </sub>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-0 w-full">
            <div className="flex border-t">
              <input
                type="text"
                className="w-full p-2 cursor-text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    handleSendMsg();
                  } else {
                    onKeyDownNotEnter();
                  }
                }}
              />
              <button
                className="px-2 text-white bg-white"
                onClick={() => handleSendMsg()}
              >
                <svg
                  className="svg-inline--fa fa-paper-plane fa-w-16 text-[#2180f3]"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="paper-plane"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatContainer;
