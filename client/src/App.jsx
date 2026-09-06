import { useState, useEffect } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import StatsWidget from './StatsWidget';
import FilterWidget from './FilterWidget';
import TicketListWidget from './TicketListWidget';
import './App.css';

// 定义可拖拽的单个组件容器
function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="sortable-item">
      {children}
    </div>
  );
}

function App() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 定义仪表板的组件顺序
  const [items, setItems] = useState(['stats', 'filters', 'list']);
  
  const [filters, setFilters] = useState({ status: 'All', category: 'All', priority: 'All' });

  useEffect(() => {
    fetch('http://localhost:3000/api/tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setFilteredTickets(data);
        setLoading(false);
      })
      .catch(err => console.error("Error:", err));
  }, []);

  useEffect(() => {
    let result = tickets;
    if (filters.status !== 'All') result = result.filter(t => t.status === filters.status);
    if (filters.category !== 'All') result = result.filter(t => t.category === filters.category);
    if (filters.priority !== 'All') result = result.filter(t => t.priority === filters.priority);
    setFilteredTickets(result);
  }, [filters, tickets]);

  // 拖拽传感器设置
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const categories = ['All', ...new Set(tickets.map(t => t.category))];
  const statuses = ['All', ...new Set(tickets.map(t => t.status))];
  const priorities = ['All', ...new Set(tickets.map(t => t.priority))];

  if (loading) return <div className="loading">Loading...</div>;

  // 映射 ID 到实际组件
  const widgetMap = {
    stats: <StatsWidget tickets={tickets} />,
    filters: <FilterWidget filters={filters} setFilters={setFilters} categories={categories} statuses={statuses} priorities={priorities} />,
    list: <TicketListWidget tickets={filteredTickets} />
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Butler Asia Maintenance Dashboard</h1>
          <p className="subtitle">Drag and drop widgets to customize your view</p>
        </header>
        
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="dashboard-layout">
            {items.map(id => (
              <SortableItem key={id} id={id}>
                {widgetMap[id]}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </div>
    </DndContext>
  );
}

export default App;