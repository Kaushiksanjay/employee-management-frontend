export function LoadingState() {
  return (
    <div className="state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>Loading employees…</p>
    </div>
  );
}

export function EmptyState({ isFiltered, onAdd, onClearFilters }) {
  return (
    <div className="state">
      <h2>{isFiltered ? "No employees match your filters" : "No employees yet"}</h2>
      <p>
        {isFiltered
          ? "Try a different name or status."
          : "Add the first employee to get started."}
      </p>
      {isFiltered ? (
        <button type="button" className="btn" onClick={onClearFilters}>Clear filters</button>
      ) : (
        <button type="button" className="btn btn--primary" onClick={onAdd}>Add employee</button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <h2>Couldn't load employees</h2>
      <p>{message}</p>
      <button type="button" className="btn btn--primary" onClick={onRetry}>Try again</button>
    </div>
  );
}
