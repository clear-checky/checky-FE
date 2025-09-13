import type { RiskLevel } from "./types";  

export const riskStyle = (risk: RiskLevel) => {
  switch (risk) {
    case "danger":
      return {
        chip: "bg-red text-white",
        border: "border-red",
        text: "text-red",
        bar: "bg-red",
      };
    case "warning":
      return {
        chip: "bg-yellow text-black",
        border: "border-yellow",
        text: "text-yellow",
        bar: "bg-yellow",
      };
    case "safe":
      // 요구: 안전 = 검정 표시
      return {
        chip: "bg-black text-white",
        border: "border-black",
        text: "text-black",
        bar: "bg-black",
      };
  }
};