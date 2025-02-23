// GeminiChat.jsx
import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import "./GeminiChat.css";

// Safety settings for Gemini
const safetySetting = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_PUBLIC_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySetting,
});

export const streamGeminiResponse = async (question, onChunk) => {
  try {
    const chat = model.startChat({ history: [], generationConfig: {} });
    const result = await chat.sendMessageStream([question]);
    let accumulatedText = "";
    
    for await (const chunk of result.stream) {
      const text = chunk.text();
      // Split new text into individual characters
      for (const char of text) {
        accumulatedText += char;
        onChunk?.(accumulatedText);
        // Add slight delay between characters for smooth animation
        await new Promise(resolve => setTimeout(resolve, 20));
      }
    }
    return accumulatedText;
  } catch (error) {
    console.error("Error getting Gemini response:", error);
    onChunk?.("An error occurred while fetching the response.");
    return "An error occurred while fetching the response.";
  }
};

const GeminiChat = ({ answer, isComplete }) => {
  return (
    <div className="message gemini-message">
      <div className="message-content">
        <Markdown remarkPlugins={[remarkGfm]}>{answer}</Markdown>
        {!isComplete && <span className="typing-indicator" />}
      </div>
    </div>
  );
};

export default GeminiChat;