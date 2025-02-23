import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { chatbotData } from '../data/chatbotData';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: chatbotData.greeting, sender: 'bot' }]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestMatch = (question: string) => {
    const userWords = question.toLowerCase().split(' ');
    let bestMatch = null;
    let highestScore = 0;

    chatbotData.questions_and_answers.forEach(qa => {
      const qaWords = qa.question.toLowerCase().split(' ');
      let score = 0;

      userWords.forEach(word => {
        if (qaWords.includes(word)) score++;
      });

      if (qa.question.toLowerCase().includes('3d printer') && question.toLowerCase().includes('3d printer')) {
        score += 2;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = qa;
      }
    });

    return highestScore > 0 ? bestMatch : null;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);

    const match = findBestMatch(input);
    const botMessage = {
      text: match ? match.answer : "I'm sorry, I don't have an answer for that question. Please try rephrasing or ask something else.",
      sender: 'bot'
    };

    setTimeout(() => {
      setMessages(prev => [...prev, botMessage]);
    }, 500);

    setInput('');
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 flex items-center space-x-2 px-6 py-3 rounded-full glass-effect text-white border border-white/10 hover:border-purple-500/20 shadow-lg hover:shadow-purple-500/10 transform hover:scale-105 transition-all duration-300"
        >
          <MessageCircle size={20} className="text-purple-400" />
          <span className="font-light">Chat with AI</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[95%] sm:w-[400px] h-[500px] rounded-2xl flex flex-col overflow-hidden border border-white/10 shadow-lg shadow-purple-500/10">
          <div className="p-4 glass-effect border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <h3 className="font-light text-white">PrintMaster AI</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-4 glass-effect">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-purple-500/10 border border-purple-500/20'
                      : 'bg-white/5 border border-white/5'
                  }`}
                >
                  <p className="text-white/90 font-light">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 glass-effect border-t border-white/5">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about 3D printing..."
                className="flex-1 p-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/20"
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-xl glass-effect border border-white/10 text-purple-400 hover:text-purple-300 hover:border-purple-500/20 transition-all duration-300"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}