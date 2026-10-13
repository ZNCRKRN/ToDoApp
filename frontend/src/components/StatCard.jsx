import { memo } from "react";

function StatCard({ label, value, accent }) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}

export default memo(StatCard);
