import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import About from './About.jsx';
import ExamCountdown from './ExamCountdown.jsx';
import Tasks from './Tasks.jsx';
import Rewards from './Rewards.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/countdown" element={<ExamCountdown />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/rewards" element={<Rewards />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);