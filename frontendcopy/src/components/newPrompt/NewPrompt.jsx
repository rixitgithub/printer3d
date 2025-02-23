import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import GeminiChat, { streamGeminiResponse } from "../response/GeminiChat";
import YouTubeSearch, { searchYouTube } from "../response/YoutubeSearch";

const NewPrompt = ({ data }) => {
  const [query, setQuery] = useState("");
  const [geminiAnswer, setGeminiAnswer] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [img, setImg] = useState({
    isLoading: false,
    dbData: {},
    aiData: {},
  });
  const [isGeminiComplete, setIsGeminiComplete] = useState(false);
  const [options, setOptions] = useState({ text: true, video: false });
  const endRef = useRef(null);
  const formRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [query, geminiAnswer, videoData]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      console.log("Sending request body to backend:", payload);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${data._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      return res.json();
    },
    onSuccess: (updatedChat) => {
      // If the current chat id is null (or "null"), navigate to the new chat route.
      if (!data._id || data._id === "null" || data._id !== updatedChat._id) {
        navigate(`/dashboard/chats/${updatedChat._id}`);
      }
      queryClient
        .invalidateQueries({ queryKey: ["chat", updatedChat._id] })
        .then(() => {
          formRef.current.reset();
          setQuery("");
          setGeminiAnswer("");
          setVideoData(null);
          setImg({ isLoading: false, dbData: {}, aiData: {} });
          setIsGeminiComplete(false);
        });
    },
    onError: (err) => {
      console.error("Mutation Error:", err);
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

    try {
      const finalAnswer = await streamGeminiResponse(text, setGeminiAnswer);
      setGeminiAnswer(finalAnswer);
      setIsGeminiComplete(true);

      const video = await searchYouTube(text);
      setVideoData(video);

      const dataToSend = {
        question: text,
        answer: options.text ? finalAnswer : null,
        img: img.dbData?.filePath || null,
        video:
          options.video && video
            ? {
                title: video.title,
                url: video.url,
                thumbnail: video.thumbnail,
              }
            : null,
      };

      setTimeout(() => {
        mutation.mutate(dataToSend);
      }, 100);
    } catch (err) {
      console.error("Error processing query:", err);
    }
  };

  const toggleOption = (option) => {
    setOptions((prev) => {
      const newOptions = { ...prev, [option]: !prev[option] };
      // Ensure at least one option remains active
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
        <input type="text" name="text" placeholder="Ask anything..." />
        <div className="controls-container">
          <div className="left-controls">
            <div className="option-buttons">
              <button
                type="button"
                className={`option-button ${options.text ? "active" : ""}`}
                onClick={() => toggleOption("text")}
              >
                Text
              </button>
              <button
                type="button"
                className={`option-button ${options.video ? "active" : ""}`}
                onClick={() => toggleOption("video")}
              >
                Video
              </button>
            </div>
            <div className="uploadbtn">
              <Upload setImg={setImg} />
            </div>
          </div>
          <button type="submit">
            <img src="/arrow.png" alt="Submit" />
          </button>
        </div>
      </form>
    </>
  );
};

export default NewPrompt;
