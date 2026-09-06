export default function StatsWidget({ tickets }) {
  return (
    <div className="widget stats-widget">
      <h2>Overview</h2>
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{tickets.length}</span>
          <span className="stat-label">Total Tickets</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{tickets.filter(t => t.status === 'Open').length}</span>
          <span className="stat-label">Open</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{tickets.filter(t => t.priority === 'Critical').length}</span>
          <span className="stat-label">Critical</span>
        </div>
      </div>
    </div>
  );
}