import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./chatList.css";

const ChatList = ({ isExpanded, onToggle }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const groupChatsByDate = (chats) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    return chats.reduce((acc, chat) => {
      const chatDate = new Date(chat.createdAt).toDateString();
      let dateLabel =
        chatDate === today ? "Today" : chatDate === yesterday ? "Yesterday" : chatDate;

      if (!acc[dateLabel]) acc[dateLabel] = [];
      acc[dateLabel].push(chat);
      return acc;
    }, {});
  };

  return (
    <div className={`chatList ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="chatList-header">
        <button className="collapse-button" onClick={() => onToggle(!isExpanded)}>
          {isExpanded ? "◀" : "▶"}
        </button>
        {isExpanded && <span className="dashboard-title">DASHBOARD</span>}
      </div>
      {isExpanded && (
        <>
          <Link to="/dashboard" className="create-chat">
            <button className="create-chat-button">
              <span className="plus-icon">+</span> Create a new Chat
            </button>
          </Link>
          <Link to="/" className="menuItem">Explore Future Printer</Link>
          <hr />
          <span className="title">RECENT CHATS</span>
          <div className="list">
            {isLoading ? (
              <span className="loading">Loading...</span>
            ) : error ? (
              <span>No Chats Found </span>
            ) : (
              Object.entries(groupChatsByDate(data || [])).map(([date, chats]) => (
                <div key={date} className="date-group">
                  <span className="date-label">{date}</span>
                  {chats.map((chat) => (
                    <Link
                      to={`/dashboard/chats/${chat._id}`}
                      key={chat._id}
                      className="chatItem"
                      title={chat.title}
                      onClick={() => onToggle(!isExpanded)}
                    >
                      <span className="chatTitle">{chat.title}</span>
                    </Link>
                  ))}
                </div>
              ))
            )}
          </div>
          <div className="upgrade">
            <div className="texts">
              <span>Upgrade to Pro</span>
              <span>Unlock all features</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatList;