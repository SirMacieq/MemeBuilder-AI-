"use client";
import { useState } from "react";

import { cn } from "@/lib/utils";

function Textarea({
  className,
  maxLength = 180,
  ...props
}: React.ComponentProps<"textarea">) {
  const [bio, setBio] = useState<number>(props.value?.toString().length ?? 0);

  return (
    <>
      <textarea
        data-slot="textarea"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-16 x-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full h-[120px] resize-none bg-[#151925] border border-white/5 p-[16px] rounded-[12px] placeholder:text-white placeholder:text-opacity-50 text-white break-words break-all whitespace-pre-wrap overflow-auto",
          className,
        )}
        {...props}
        onChange={(e) => {
          props.onChange?.(e);
          setBio(e.target.value.length);
        }}
      />
      <div
        className={
          "text-right text-sm font-light text-[#909090]" +
          (bio > maxLength ? " text-red-500" : "")
        }
      >
        {bio}/{maxLength}
      </div>
    </>
  );
}

export { Textarea };
