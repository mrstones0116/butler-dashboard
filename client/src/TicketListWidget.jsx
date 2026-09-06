export default function TicketListWidget({ tickets }) {
  if (tickets.length === 0) return <div className="widget"><p>No tickets found.</p></div>;

  return (
    <div className="widget ticket-list-widget">
      <h2>Maintenance Tickets ({tickets.length})</h2>
      <div className="ticket-grid">
        {tickets.map(ticket => (
          <div key={ticket.id} className={`ticket-card priority-${ticket.priority.toLowerCase()}`}>
            <div className="ticket-header">
              <span className="ticket-id">#{ticket.id}</span>
              <span className={`status-badge status-${ticket.status.toLowerCase().replace(' ', '-')}`}>
                {ticket.status}
              </span>
            </div>
            <h3>{ticket.title}</h3>
            <div className="ticket-meta">
              <span className="category">{ticket.category}</span>
              <span className="priority">Priority: {ticket.priority}</span>
              <span className="date">{ticket.created}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}