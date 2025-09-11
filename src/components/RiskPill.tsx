import React from "react";
import type { RiskLevel } from "./types";

export default function RiskPill({ risk }: { risk: RiskLevel }) {
  const label =
    risk === "danger" ? "위험" : risk === "warning" ? "주의" : "안전";

  const styles: Record<RiskLevel, string> = {
    danger: "bg-red/20 text-red font-semibold",
    warning: "bg-yellow/20 text-yellow font-semibold",
    safe: "bg-green/20 text-green font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] ${styles[risk]}`}
    >
      {label}
    </span>
  );
}