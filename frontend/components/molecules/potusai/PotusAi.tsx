import { useEffect, useState } from "react";
import { X, SendHorizonal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import "./PotusAi.css";

interface PotusAIProps {
  onSendMessage: (message: string) => void;
  messages: { role: string; content: string; refusal?: any }[];
  isLoading?: boolean;
  isOpen: boolean;
  validation: () => void;
  onClose: () => void;
}

export default function ChatGPT({
  onSendMessage,
  messages,
  isLoading,
  isOpen,
  validation,
  onClose,
}: PotusAIProps) {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState(messages);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleRefusal = (index: number, status: "accepted" | "rejected") => {
    const updated = [...localMessages];
    updated[index].refusal = status;
    setLocalMessages(updated);
    if (status === "accepted") {
      validation();
    }
  };

  useEffect(() => {
    setLocalMessages(messages);
    messages;
  }, [messages]);

  return (
    <div
      className={`fixed bottom-0 right-4 w-full max-w-md shadow-xl border rounded-xl bg-white transition-transform duration-300 z-50 ${
        !isOpen ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-black">POTUS AI</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 transition"
        >
          <X size={20} />
        </button>
      </div>
      <div className="h-96 overflow-y-auto p-4 space-y-3">
        {localMessages.map((message, index) => (
          <div
            key={index}
            className={`whitespace-pre-wrap rounded-xl px-4 py-2 max-w-[90%] ${
              message.role === "user"
                ? "bg-blue-100 text-blue-900 self-end ml-auto"
                : "bg-gray-100 text-gray-800 self-start"
            }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>

            {message.role !== "user" && !message.refusal && (
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  onClick={() => handleRefusal(index, "accepted")}
                >
                  ✅ Accept
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  onClick={() => handleRefusal(index, "rejected")}
                >
                  ❌ Refuse
                </button>
              </div>
            )}

            {message.refusal === "accepted" && (
              <p className="text-green-600 mt-2 text-sm">Accepted ✅</p>
            )}
            {message.refusal === "rejected" && (
              <p className="text-red-600 mt-2 text-sm">Refused ❌</p>
            )}
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="flex items-center gap-2 text-gray-500 text-sm animate-pulse">
          <span className="loader" />{" "}
          {/* Optionnel : créer un CSS spinner ou remplacer par un composant */}
          POTUS AI is thinking...
        </div>
      )}
      <div className="flex items-center gap-2 border-t p-3">
        <textarea
          className="w-full resize-none border rounded-lg p-2 text-sm focus:outline-none focus:ring focus:border-blue-300 placeholder:text-gray-800 text-black disabled:opacity-50"
          rows={1}
          placeholder={
            isLoading ? "Waiting for response..." : "Type your message..."
          }
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  );
}
