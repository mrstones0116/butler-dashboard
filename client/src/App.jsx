import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './App.css';

function SortableTicketCard({ ticket }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  const priorityConfig = {
    Critical: { color: '#ef4444', bg: '#fef2f2', icon: '🔴' },
    High: { color: '#f97316', bg: '#fff7ed', icon: '🟠' },
    Medium: { color: '#eab308', bg: '#fefce8', icon: '🟡' },
    Low: { color: '#22c55e', bg: '#f0fdf4', icon: '🟢' },
  };

  const statusConfig = {
    Open: { color: '#3b82f6', bg: '#eff6ff' },
    'In Progress': { color: '#8b5cf6', bg: '#f5f3ff' },
    Closed: { color: '#22c55e', bg: '#f0fdf4' },
    Pending: { color: '#f59e0b', bg: '#fffbeb' },
  };

  const priority = priorityConfig[ticket.priority] || priorityConfig.Low;
  const status = statusConfig[ticket.status] || statusConfig.Open;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`ticket-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="ticket-card-top">
        <span className="ticket-id">TK-{String(ticket.id).padStart(3, '0')}</span>
        <span
          className="status-badge"
          style={{ backgroundColor: status.bg, color: status.color }}
        >
          {ticket.status}
        </span>
      </div>

      <h3 className="ticket-title">{ticket.title}</h3>

      <div className="ticket-card-bottom">
        <div className="ticket-tags">
          <span className="tag category-tag">{ticket.category}</span>
          <span
            className="tag priority-tag"
            style={{ backgroundColor: priority.bg, color: priority.color }}
          >
            {priority.icon} {ticket.priority}
          </span>
        </div>
        <span className="ticket-date">{ticket.created}</span>
      </div>
    </div>
  );
}

function App() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    category: 'All',
    priority: 'All',
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/tickets')
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setFilteredTickets(data);
        setLoading(false);
      })
      .catch((err) => console.error('Error:', err));
  }, []);

  useEffect(() => {
    let result = tickets;
    if (filters.status !== 'All')
      result = result.filter((t) => t.status === filters.status);
    if (filters.category !== 'All')
      result = result.filter((t) => t.category === filters.category);
    if (filters.priority !== 'All')
      result = result.filter((t) => t.priority === filters.priority);
    if (searchTerm)
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredTickets(result);
  }, [filters, tickets, searchTerm]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFilteredTickets((prevItems) => {
        const oldIndex = prevItems.findIndex((t) => t.id === active.id);
        const newIndex = prevItems.findIndex((t) => t.id === over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  };

  const categories = ['All', ...new Set(tickets.map((t) => t.category))];
  const statuses = ['All', ...new Set(tickets.map((t) => t.status))];
  const priorities = ['All', ...new Set(tickets.map((t) => t.priority))];

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'Open').length,
    inProgress: tickets.filter((t) => t.status === 'In Progress').length,
    critical: tickets.filter((t) => t.priority === 'Critical').length,
  };

  if (loading)
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading maintenance tickets...</p>
      </div>
    );

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🏢 Butler Asia</h1>
          <p className="subtitle">Maintenance Ticket Dashboard</p>
        </div>
        <div className="header-right">
          <span className="last-updated">Last updated: just now</span>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Tickets</span>
          </div>
        </div>
        <div className="stat-card stat-open">
          <div className="stat-icon">📂</div>
          <div className="stat-info">
            <span className="stat-value">{stats.open}</span>
            <span className="stat-label">Open</span>
          </div>
        </div>
        <div className="stat-card stat-progress">
          <div className="stat-icon">⚙️</div>
          <div className="stat-info">
            <span className="stat-value">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div className="stat-card stat-critical">
          <div className="stat-icon">🚨</div>
          <div className="stat-info">
            <span className="stat-value">{stats.critical}</span>
            <span className="stat-label">Critical</span>
          </div>
        </div>
      </div>

      {/* Toolbar: Search + Filters */}
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? '📊 Status: All' : s}
              </option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? '🏷️ Category: All' : c}
              </option>
            ))}
          </select>
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p === 'All' ? '⚡ Priority: All' : p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="results-info">
        <span>
          Showing <strong>{filteredTickets.length}</strong> of{' '}
          <strong>{tickets.length}</strong> tickets
        </span>
        <span className="drag-hint">💡 Drag cards to reorder</span>
      </div>

      {/* Ticket Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredTickets.map((t) => t.id)}
          strategy={rectSortingStrategy}
        >
          <div className="ticket-grid">
            {filteredTickets.map((ticket) => (
              <SortableTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {filteredTickets.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>No tickets match your filters.</p>
          <button
            className="reset-btn"
            onClick={() => {
              setFilters({ status: 'All', category: 'All', priority: 'All' });
              setSearchTerm('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default App;