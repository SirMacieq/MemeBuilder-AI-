import React from "react";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProposalTypeBadgeProps {
  type: "funded" | "treasury" | "dao";
  variant?: "default" | "small";
}
const texts = {
  funded: "Funded",
  treasury: "Treasury based",
  dao: "General DAO",
};
const styles = {
  base: "text-white flex center items-center  md:text-[14px] ",
  variants: {
    default: "p-[8px] rounded-[12px] text-[10px]",
    small: "py-[4px] px-[8px] rounded-[4px] text-[14px]",
  },
  types: {
    funded: "bg-[#FDA900]",
    treasury: "bg-[#098906]",
    dao: "bg-[#890606]",
  },
};
const ProposalTypeBadge = ({
  type,
  variant = "default",
}: ProposalTypeBadgeProps) => {
  return (
    <p
      className={cn(styles.base, styles.variants[variant], styles.types[type])}
    >
      {variant !== "small" && <Rocket className="mr-1" />}
      {texts[type]}
    </p>
  );
};

export default ProposalTypeBadge;
