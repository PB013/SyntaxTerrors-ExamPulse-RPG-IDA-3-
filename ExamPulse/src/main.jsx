import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import About from './About.jsx';
import ExamCountdown from './ExamCountdown.jsx';
import Tasks from './Tasks.jsx';
import Rewards from './Rewards.jsx';
import './index.css';
import Navbar from './Navbar.jsx';


// Wrapper that holds shared gold/xp/level state
function Root() {
  const [xp, setXp] = useState(() => Number(localStorage.getItem('exampulse-xp') || 0));
  const [gold, setGold] = useState(() => Number(localStorage.getItem('exampulse-gold') || 0));
  const [level, setLevel] = useState(() => Number(localStorage.getItem('exampulse-level') || 1));

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/countdown" element={<ExamCountdown />} />
        <Route
          path="/tasks"
          element={
            <Tasks
              xp={xp} setXp={setXp}
              gold={gold} setGold={setGold}
              level={level} setLevel={setLevel}
            />
          }
        />
        <Route
          path="/rewards"
          element={
            <Rewards
              gold={gold}
              onUpdateGold={setGold}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Root />
  </StrictMode>
);