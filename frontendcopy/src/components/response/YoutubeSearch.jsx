import React, { useState, useEffect } from "react";
import axios from "axios";
import "./YouTubeSearch.css";

export const searchYouTube = async (query) => {
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: query,
        type: "video", // Prioritizes video results
        maxResults: 1,
        key: import.meta.env.VITE_YOUTUBE_API_KEY,
      },
    });

    let videoItem = response.data.items.find(item => item.id.videoId);

    if (!videoItem) {
      // If no video is found, check if the result is a channel
      const channelItem = response.data.items.find(item => item.id.channelId);
      if (channelItem) {
        // Fetch the most popular video from the channel
        const channelVideos = await axios.get("https://www.googleapis.com/youtube/v3/search", {
          params: {
            part: "snippet",
            channelId: channelItem.id.channelId,
            order: "viewCount", // Get most viewed video
            maxResults: 1,
            type: "video",
            key: import.meta.env.VITE_YOUTUBE_API_KEY,
          },
        });

        videoItem = channelVideos.data.items[0]; // Pick the top result
      }
    }

    if (!videoItem) return null; // If still no video, return null

    return {
      title: videoItem.snippet.title || "No Title Found",
      url: `https://www.youtube.com/watch?v=${videoItem.id.videoId}`,
      thumbnail: videoItem.snippet.thumbnails?.high?.url || "",
    };
  } catch (error) {
    console.error("YouTube API Error:", error);
    return null;
  }
};

const YouTubeSearch = ({ query, video: externalVideo }) => {
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query && !externalVideo) {
      setIsLoading(true);
      searchYouTube(query).then((vidData) => {
        setVideo(vidData);
        setIsLoading(false);
      });
    } else {
      setVideo(externalVideo);
      setIsLoading(false);
    }
  }, [query, externalVideo]);

  return (
    <div className="youtube-container message">
      {isLoading ? (
        <div className="youtube-loading">Finding best video for you...</div>
      ) : (
        video && (
          <div className="video-container message-content">
            <iframe
              id="youtube-iframe"
              width="560"
              height="315"
              src={`${video.url.replace("watch?v=", "embed/")}?enablejsapi=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )
      )}
    </div>
  );
};

export default YouTubeSearch;
