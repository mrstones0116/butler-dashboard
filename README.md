# Butler Asia Maintenance Dashboard

A modern, draggable maintenance ticket dashboard built with React and Node.js. Designed for facility managers to quickly assess building status and prioritize critical issues.

## ✨ Features

- **Real-time Ticket Display**: Fetches data from a Node.js REST API
- **Multi-dimensional Filtering**: Filter by Status, Category, and Priority simultaneously
- **Draggable Dashboard Layout**: Customize widget order using @dnd-kit (Stats → Filters → List)
- **Responsive Design**: Works on desktop and tablet viewports
- **Priority Visual Cues**: Color-coded borders for Critical/High/Medium/Low tickets

## 🛠 Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18 + Vite                     |
| Backend  | Node.js + Express                   |
| Drag     | @dnd-kit/core + @dnd-kit/sortable   |
| Data     | JSON file (50 realistic records)    |

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9

### 1. Clone & Install
```bash
git clone https://github.com/mrstones0106/butler-dashboard.git
cd butler-dashboard

# Install backend dependencies
cd server && npm install && cd ..

# Install frontend dependencies
cd client && npm install && cd ..
```

### 2. Run Development Servers
Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd server
node src/index.js
# Server runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

## 📁 Project Structure
```
butler-dashboard/
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx      # Main layout + DnD logic
│   │   ├── StatsWidget.jsx
│   │   ├── FilterWidget.jsx
│   │   └── TicketListWidget.jsx
├── server/              # Express backend
│   ├── src/index.js     # API endpoint
│   └── data/tickets.json # 50 sample records
└── README.md
```

## 🎨 Design Decisions

1. **Widget-based Architecture**: Instead of a monolithic page, the dashboard is composed of independent sortable widgets. This allows future extensibility (e.g., adding charts or maps).
2. **Activation Constraint on Drag**: Added 5px distance threshold to prevent accidental drags when clicking filters or buttons.
3. **Color-coded Priorities**: Left border colors provide instant visual scanning without reading text — critical for emergency response scenarios.
4. **Server-side Data Source**: Even though it's JSON, using an API layer mirrors real-world architecture and makes swapping to a database trivial later.

## 🔮 Future Improvements
- Persist widget order to localStorage
- Add ticket detail modal / edit functionality
- Replace JSON with SQLite/PostgreSQL
- Add dark mode toggle
```
