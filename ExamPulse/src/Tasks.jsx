import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import TasksColumn from './TasksColumn';
import './App.css';
import './Tasks.css';

const XP_PER_TASK = { daily: 15, todo: 20 };
const GOLD_PER_TASK = { daily: 5, todo: 8 };
const XP_TO_LEVEL_UP = 200;

const makeTask = (name, subject, type) => ({
  id: crypto.randomUUID(),
  name,
  subject: subject || '',
  type,
  done: false,
  xp: XP_PER_TASK[type],
  gold: GOLD_PER_TASK[type],
});

const defaultTasks = [
  makeTask('Review notes', 'Math', 'daily'),
  makeTask('Read chapter', 'History', 'daily'),
  makeTask('Finish assignment', 'Science', 'todo'),
  makeTask('Practice problems', 'Math', 'todo'),
];

function Tasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('exampulse-tasks');
      return saved ? JSON.parse(saved) : defaultTasks;
    } catch {
      return defaultTasks;
    }
  });

  const [xp, setXp] = useState(() => Number(localStorage.getItem('exampulse-xp') || 0));
  const [gold, setGold] = useState(() => Number(localStorage.getItem('exampulse-gold') || 0));
  const [level, setLevel] = useState(() => Number(localStorage.getItem('exampulse-level') || 1));
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('exampulse-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('exampulse-xp', xp);
    localStorage.setItem('exampulse-gold', gold);
    localStorage.setItem('exampulse-level', level);
  }, [xp, gold, level]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.done) return;

    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: true } : t));

    const newXp = xp + task.xp;
    const newGold = gold + task.gold;

    if (newXp >= XP_TO_LEVEL_UP) {
      setLevel(l => l + 1);
      setXp(newXp - XP_TO_LEVEL_UP);
      showToast('LEVEL UP! You reached level ' + (level + 1) + '!');
    } else {
      setXp(newXp);
      showToast('+' + task.xp + ' XP  +' + task.gold + ' Gold');
    }
    setGold(newGold);
  };

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAdd = (type) => ({ name, subject }) => {
    setTasks(prev => [...prev, makeTask(name, subject, type)]);
  };

  const dailies = tasks.filter(t => t.type === 'daily');
  const todos = tasks.filter(t => t.type === 'todo');
  const completed = tasks.filter(t => t.done);
  const xpPercent = Math.round((xp / XP_TO_LEVEL_UP) * 100);

  return (
    <div className="task-page">
      <Navbar />

      {toast && <div className="toast">{toast}</div>}

      <div className="task-stats-bar">
        <div className="stat-item">
          <span className="stat-label">Level</span>
          <span className="stat-value">{level}</span>
        </div>
        <div className="stat-item xp-stat">
          <span className="stat-label">XP — {xp} / {XP_TO_LEVEL_UP}</span>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: xpPercent + '%' }} />
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-label">Gold</span>
          <span className="stat-value gold-value">{gold}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Done Today</span>
          <span className="stat-value">{completed.length}</span>
        </div>
      </div>

      <main className="task-board">
        <TasksColumn
          title="Dailies"
          tasks={dailies}
          color="#4CAF50"
          onComplete={handleComplete}
          onDelete={handleDelete}
          onAdd={handleAdd('daily')}
        />
        <TasksColumn
          title="To-Dos"
          tasks={todos}
          color="#2196F3"
          onComplete={handleComplete}
          onDelete={handleDelete}
          onAdd={handleAdd('todo')}
        />
        <TasksColumn
          title="Completed"
          tasks={completed}
          color="#c9a84c"
          onComplete={handleComplete}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default Tasks;