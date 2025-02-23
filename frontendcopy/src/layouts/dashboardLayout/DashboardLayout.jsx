import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/clerk-react";
import ChatList from "../../components/chatList/ChatList";
import "./dashboardLayout.css";
import { Loader2, Menu } from "lucide-react";

const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) {
    return (
      <div className="loadingContainer">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  // Toggle function for mobile view
  const toggleChatList = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div className="dashboardLayout">
      <aside className={`chatList ${isExpanded ? "expanded" : ""}`}>
        <ChatList isExpanded={isExpanded} onToggle={setIsExpanded} />
      </aside>
      <main className="content">
        <header className="content-header">
            {/* Hamburger Menu for Mobile */}
            <button className="toggle-chatList-btn" onClick={toggleChatList}>
              <Menu size={24} />
            </button>
          
            {/* User button aligned to the right-most side */}
            <div className="user-button">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: "32px",
                      height: "32px",
                    },
                  },
                }}
              />
            </div>
          </header>
        <div className="content-main">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;