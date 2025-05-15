"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

const Countdown = ({ endDate }: { endDate: Date }) => {
  const [diff, setDiff] = useState(endDate.valueOf() - Date.now());
  const isOver = endDate < new Date();
  useEffect(() => {
    const timer = setInterval(() => {
      setDiff(endDate.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  const diffSeconds = Math.abs(diff / 1000);
  const seconds = Math.floor(diffSeconds % 60);
  const minutes = Math.floor(diffSeconds / 60) % 60;
  const hours = Math.floor(diffSeconds / 3600) % 24;
  const days = Math.floor(hours / 24);

  return (
    <span className={cn(isOver ? "text-red-500" : "")}>
      {isOver ? "Ended since" : "End in"}{" "}
      <span className="font-bold">
        {days > 0 ? days + " days -" : ""}
        {hours}:{minutes}:{seconds}
      </span>
    </span>
  );
};

export default Countdown;
