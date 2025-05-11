import { useEffect, useState } from "react";
import { X, SendHorizonal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
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
      className={`fixed bottom-[16px] right-4 w-full max-w-md shadow-xl py-[16px] px-[8px] rounded-[12px] bg-[#0e131f] transition-transform duration-300 z-50 ${
        !isOpen ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex items-center justify-between px-[8px] pb-[8px]">
        <div className="flex items-center">
          <Image src="/images/potusai.jpeg" alt="" className="rounded-[222px]" width={35} height={35} />
          <h3 className="text-[24px] font-semibold ml-4">POTUS AI</h3>
        </div>
        
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white cursor-pointer transition"
        >
          <X size={30} />
        </button>
      </div>
      <div className="h-96 overflow-y-auto p-[8px] space-y-3">
        {localMessages.map((message, index) => (
          <div key={index} className="flex flex-col">
            <p
              className={`text-xs mb-2 ${
                message.role === "user" ? "text-right text-white/70 ml-auto" : "text-left text-white/70"
              }`}
            >
              {message.role === "user" ? "You asked" : "POTUS AI answered"} {new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            </p>
            <div
              key={index}
              className={`whitespace-pre-wrap rounded-[12px] px-4 py-2 max-w-[90%] ${
                message.role === "user"
                  ? "bg-[#151925] text-white self-end ml-auto"
                  : "bg-[#151925] text-white self-start"
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>

              {message.role !== "user" && !message.refusal && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="text-white px-3 py-1 rounded hover:underline cursor-pointer text-sm"
                    onClick={() => handleRefusal(index, "accepted")}
                  >
                    ✅ Accept
                  </button>
                  <button
                    className="text-white px-3 py-1 rounded hover:underline cursor-pointer text-sm"
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
                <p className="text-red-600 mt-2 text-sm">Refused</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="flex items-center gap-2 text-white text-sm animate-pulse p-2">
          <span className="loader" />{" "}
          {/* Optionnel : créer un CSS spinner ou remplacer par un composant */}
          POTUS AI is thinking...
        </div>
      )}
      <div className="flex items-center gap-2 pt-[16px]">
        <textarea
          className="w-full resize-none bg-[#151925] border-[0.5px] border-white/70 rounded-lg p-[12px] focus:outline-none focus:ring focus:border-blue-300 placeholder:text-white/70 disabled:opacity-50"
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
          className="p-[14px] rounded-[222px] text-white transition disabled:opacity-50"
          style={{
            background:
              "radial-gradient(circle at center, #7912FF 0%, #6E00FD 100%)",
          }}
        >
          <Image src="/images/send.svg" alt="" width={24} height={24} />
        </button>
      </div>
    </div>
  );
}
