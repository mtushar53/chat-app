import Image from "next/image";
import React from "react";

function ChatContacts({ contacts, currentUser, changeChat, onlineUsers }) {
  return (
    <div className="w-2/6 bg-white border-r">
      <div className="shadow-sm p-3">
        <h2>Chat List</h2>
      </div>
      <div className="contacts-container">
        {contacts.map((item) => {
          return (
            <div
              key={item._id}
              className="flex items-center p-3 shadow-sm cursor-pointer hover:bg-slate-100 relative"
              onClick={() => changeChat(item)}
            >
              <Image
                className="rounded-full"
                src="/assets/avatar.png"
                alt="avatar"
                width={32}
                height={32}
              />
              <h2 className="ml-3">{item.name}</h2>
              <span
                className={onlineUsers.includes(item._id) ? "active" : ""}
              ></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatContacts;
