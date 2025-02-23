import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import GeminiChat, { streamGeminiResponse } from "../response/GeminiChat";
import YouTubeSearch, { searchYouTube } from "../response/YoutubeSearch";

const NewPrompt = ({ data }) => {
  const [query, setQuery] = useState("");
  const [geminiAnswer, setGeminiAnswer] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [img, setImg] = useState({ isLoading: false, dbData: {}, aiData: {} });
  const [isGeminiComplete, setIsGeminiComplete] = useState(false);
  const [options, setOptions] = useState({ text: true, video: false });
  const [isProcessing, setIsProcessing] = useState(false); // NEW: Tracks request state
  const endRef = useRef(null);
  const formRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getToken } = useAuth(); 

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [query, geminiAnswer, videoData]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      if (!token) {
        throw new Error("Unauthenticated!"); 
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${data._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }

      return res.json();
    },
    onSuccess: (updatedChat) => {
      if (!data._id || data._id === "null" || data._id !== updatedChat._id) {
        navigate(`/dashboard/chats/${updatedChat._id}`);
      }
      queryClient.invalidateQueries({ queryKey: ["chat", updatedChat._id] }).then(() => {
        formRef.current.reset();
        setQuery("");
        setGeminiAnswer("");
        setVideoData(null);
        setImg({ isLoading: false, dbData: {}, aiData: {} });
        setIsGeminiComplete(false);
        setIsProcessing(false); // Enable buttons again
      });
    },
    onError: (err) => {
      console.error("Mutation Error:", err);
      setIsProcessing(false); // Ensure buttons get re-enabled on error
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    if (!text) return;

    setQuery(text);
    setGeminiAnswer("");
    setVideoData(null);
    setIsGeminiComplete(false);
    setIsProcessing(true); // Disable buttons and input field

    try {
      let finalAnswer = "";
      let video = null;

      if (options.text) {
        finalAnswer = await streamGeminiResponse(text, setGeminiAnswer);
        setIsGeminiComplete(true);
      }

      if (options.video) {
        video = await searchYouTube(text);
        setVideoData(video);
      }

      const dataToSend = {
        question: text,
        answer: options.text ? finalAnswer : null,
        img: img.dbData?.filePath || null,
        video: options.video && video ? {
          title: video.title,
          url: video.url,
          thumbnail: video.thumbnail,
        } : null,
      };

      setTimeout(() => {
        mutation.mutate(dataToSend);
      }, 100);
    } catch (err) {
      console.error("Error processing query:", err);
      setIsProcessing(false); // Re-enable UI if error occurs
    }
  };

  const toggleOption = (option) => {
    if (isProcessing) return; // Prevent changes during processing
    setOptions((prev) => {
      const newOptions = { ...prev, [option]: !prev[option] };
      if (!newOptions.text && !newOptions.video) {
        newOptions[option] = true;
      }
      return newOptions;
    });
  };

  return (
    <>
      {img.isLoading && <div className="loading">Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}

      {query && <div className="message user">{query}</div>}
      {options.text && query && (
        <GeminiChat question={query} answer={geminiAnswer} isComplete={isGeminiComplete} />
      )}
      {options.video && query && (options.text ? isGeminiComplete : true) && (
        <YouTubeSearch query={query} video={videoData} />
      )}

      <div className="endChat" ref={endRef}></div>

      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <input type="text" name="text" placeholder="Ask anything..." disabled={isProcessing} />
        <div className="controls-container">
          <div className="left-controls">
            <div className="option-buttons">
              <button
                type="button"
                className={`option-button ${options.text ? "active" : ""}`}
                onClick={() => toggleOption("text")}
                disabled={isProcessing}
              >
                Text
              </button>
              <button
                type="button"
                className={`option-button ${options.video ? "active" : ""}`}
                onClick={() => toggleOption("video")}
                disabled={isProcessing}
              >
                Video
              </button>
            </div>
            <div className="uploadbtn">
              <Upload setImg={setImg} />
            </div>
          </div>
          <button type="submit" disabled={isProcessing}>
            <img src="/arrow.png" alt="Submit" />
          </button>
        </div>
      </form>
    </>
  );
};

export default NewPrompt;
