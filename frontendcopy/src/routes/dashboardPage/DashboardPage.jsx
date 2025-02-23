import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "./dashboardPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const data = { _id: null };

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    mutation.mutate(text);
  };

  return (
    <div className="chatPage">
      <div className="wrapper">
        
          {/* Ensure the last message is visible */}
          <NewPrompt data={data}/>
        </div>
      </div>
  );
};

export default DashboardPage;