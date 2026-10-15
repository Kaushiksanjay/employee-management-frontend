export default function SearchBar({ value, onChange }) {
  return (
    <div className="field field--inline">
      <label htmlFor="employee-search">Search by name</label>
      <input
        id="employee-search"
        type="search"
        placeholder="e.g. Priya"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
