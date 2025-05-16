import React from "react";
import { useState } from "react";
import { Clipboard, Check } from "lucide-react";

const PubKeyDisplay = ({ pubkey }: { pubkey: string }) => {
  const display = pubkey.slice(0, 4) + "..." + pubkey.slice(-4);
  const [copied, setCopied] = useState<boolean>(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(pubkey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="inline-flex flex-row my-1 relative text-sm text-gray-400 rounded-full border bg-[#E8E8E8]/3 border-[#FFFFFF]/10 py-[8px] pr-2 pl-4">
      {display}
      <button
        onClick={handleCopy}
        className="ml-2 h-full text-white hover:text-green-400"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="w-5 h-5" />
        ) : (
          <Clipboard className="w-5 h-5" />
        )}
      </button>
    </span>
  );
};

export default PubKeyDisplay;
