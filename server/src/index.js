const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 启用 CORS，允许前端（localhost:5173）访问后端
app.use(cors());

// 读取 JSON 数据的辅助函数
const getTickets = () => {
  const filePath = path.join(__dirname, '../data/tickets.json');
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

// API 路由：获取所有工单
app.get('/api/tickets', (req, res) => {
  try {
    const tickets = getTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});