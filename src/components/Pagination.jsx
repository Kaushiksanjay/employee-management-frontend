const PAGE_SIZES = [5, 10, 20, 50];

/** Builds [0, "…", 4, 5, 6, "…", 19] style lists so long ranges stay compact. */
function getPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const items = new Set([0, total - 1, current - 1, current, current + 1]);
  const sorted = [...items].filter((n) => n >= 0 && n < total).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) result.push("…");
    result.push(n);
  });
  return result;
}

export default function Pagination({
  page, // zero-based
  pageSize,
  totalPages,
  totalElements,
  onPageChange,
  onPageSizeChange,
}) {
  if (totalElements === 0) return null;

  const from = page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, totalElements);

  return (
    <nav className="pagination" aria-label="Pagination">
      <p className="pagination__range">
        Showing {from}–{to} of {totalElements}
      </p>

      <div className="pagination__controls">
        <button type="button" className="btn" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>

        {getPageItems(page, totalPages).map((item, index) =>
          item === "…" ? (
            <span key={`gap-${index}`} className="pagination__gap" aria-hidden="true">…</span>
          ) : (
            <button
              key={item}
              type="button"
              className={`btn pagination__page ${item === page ? "is-current" : ""}`}
              aria-current={item === page ? "page" : undefined}
              aria-label={`Page ${item + 1}`}
              onClick={() => onPageChange(item)}
            >
              {item + 1}
            </button>
          )
        )}

        <button
          type="button"
          className="btn"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>

      <div className="field field--inline pagination__size">
        <label htmlFor="page-size">Rows per page</label>
        <select id="page-size" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
    </nav>
  );
}
