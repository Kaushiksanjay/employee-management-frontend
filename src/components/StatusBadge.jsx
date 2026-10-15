import { STATUS } from "../utils/constants";

export default function StatusBadge({ status }) {
  const isActive = status === STATUS.ACTIVE;
  return (
    <span className={`badge ${isActive ? "badge--active" : "badge--inactive"}`}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
