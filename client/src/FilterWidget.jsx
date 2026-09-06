export default function FilterWidget({ filters, setFilters, categories, statuses, priorities }) {
  return (
    <div className="widget filter-widget">
      <h2>Filters</h2>
      <div className="filter-bar">
        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})}>
          {priorities.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
    </div>
  );
}