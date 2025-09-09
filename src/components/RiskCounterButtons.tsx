import React from "react";

type Props = {
  danger: number;
  warning: number;
  safe: number;
};

export default function RiskCounterButtons({ danger, warning, safe }: Props) {
  const Btn = ({
    label,
    value,
    className,
  }: {
    label: string;
    value: number;
    className: string;
  }) => (
    <button
      type="button"
      className={`inline-flex items-center gap-1 rounded-full px-4 py-0.5 font-semibold text-[12px] shadow-sm ${className}`}
    >
      <span>{label}</span>
      <span className="font-bold text-[16px]">{value}</span>
    </button>
  );

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <Btn label="위험" value={danger} className="bg-red/20 text-red"  />
      <Btn label="주의" value={warning} className="bg-yellow/20 text-yellow" />
      <Btn label="안전" value={safe} className="bg-green/20 text-green" />
    </div>
  );
}