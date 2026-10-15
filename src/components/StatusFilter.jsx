import { STATUS_FILTER } from "../utils/constants";

const OPTIONS = [
  { value: STATUS_FILTER.ALL, label: "All" },
  { value: STATUS_FILTER.ACTIVE, label: "Active" },
  { value: STATUS_FILTER.INACTIVE, label: "Inactive" },
];

export default function StatusFilter({ value, onChange }) {
  return (
    <div className="field field--inline">
      <span id="status-filter-label">Status</span>
      <div className="segmented" role="group" aria-labelledby="status-filter-label">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={value === option.value ? "is-selected" : ""}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
