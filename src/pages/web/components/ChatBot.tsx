import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Minimize2, Maximize2 } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! 👋 I'm your AI inventory assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const botResponses = [
    "I can help you optimize your inventory management with our AI-powered system.",
    "Our solution reduces inventory costs by up to 30% through predictive analytics.",
    "Would you like a personalized demo of our inventory management platform?",
    "I can show you how our AI analyzes your historical data to predict future inventory needs.",
    "Did you know our system integrates with all major ERP and e-commerce platforms?",
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
    };
    setMessages([...messages, userMessage]);
    setNewMessage("");

    setTimeout(() => {
      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className={`
          flex items-center justify-center
          w-14 h-14 rounded-full
          bg-gradient-to-r from-blue-500 to-blue-600
          text-white shadow-lg 
          transition-all duration-300
          hover:shadow-xl hover:scale-110
        `}
        aria-label="Open chat"
      >
        <MessageSquare size={24} className="animate-pulse" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className={`
            absolute bottom-16 right-0
            w-80 sm:w-96 
            bg-white dark: rounded-lg shadow-2xl
            flex flex-col
            transition-all duration-300 ease-in-out
            ${isMinimized ? "h-16" : "h-96"}
          `}
        >
          {/* Chat header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <MessageSquare size={20} />
              <h3 className="font-medium">AI Inventory Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMinimize}
                className="p-1 hover:bg-blue-700 rounded"
              >
                {isMinimized ? (
                  <Maximize2 size={16} />
                ) : (
                  <Minimize2 size={16} />
                )}
              </button>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-blue-700 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat messages */}
          {!isMinimized && (
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-xs sm:max-w-sm p-3 rounded-lg
                      ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }
                    `}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Chat input */}
          {!isMinimized && (
            <div className="p-3 border-t border-gray-200 flex">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white p-2 rounded-r-md"
              >
                <Send size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
