import RiskCounterButtons from './RiskCounterButtons';

type Counts = { danger: number; warning: number; safe: number };

export default function SectionHeader({
  title,
  subtitle,
  counts,
}: {
  title: string;
  subtitle?: string;
  counts?: Counts;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-[22px] font-semibold text-black">{title}</h2>
      {subtitle && <p className="text-gray mt-1">{subtitle}</p>}

      {counts && (
        <RiskCounterButtons
          danger={counts.danger}
          warning={counts.warning}
          safe={counts.safe}
        />
      )}
    </div>
  );
}
