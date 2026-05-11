import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import DinoGame from './DinoGame';
import './App.css';

const XP_PER_CLEAR = 50;
const GOLD_PER_CLEAR = 20;
const XP_TO_LEVEL_UP = 200;

export default function ExamCountdown() {
  const [exams, setExams] = useState(() => {
    try {
      const saved = localStorage.getItem('exampulse-exams');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Global Dashboard States
  const [xp, setXp] = useState(() => Number(localStorage.getItem('exampulse-xp') || 0));
  const [gold, setGold] = useState(() => Number(localStorage.getItem('exampulse-gold') || 0));
  const [level, setLevel] = useState(() => Number(localStorage.getItem('exampulse-level') || 1));
  const [completedCount, setCompletedCount] = useState(() => Number(localStorage.getItem('exampulse-done-today') || 0));
  const [toast, setToast] = useState(null);  

  // Form states
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [room, setRoom] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [showGame, setShowGame] = useState(false);
  const [currentGameId, setCurrentGameId] = useState(null);

  useEffect(() => {
    localStorage.setItem('exampulse-exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('exampulse-xp', xp);
    localStorage.setItem('exampulse-gold', gold);
    localStorage.setItem('exampulse-level', level);
    localStorage.setItem('exampulse-done-today', completedCount);
  }, [xp, gold, level, completedCount]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const getStatusColor = (targetDate) => {
    const diff = new Date(targetDate) - new Date();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (daysLeft <= 1) return 'red-underline';
    if (daysLeft <= 3) return 'orange-underline';
    if (daysLeft <= 7) return 'yellow-underline';
    return 'green-underline';
  };

  const handleAddExam = (newExam) => {
    setExams((prev) => [...prev, newExam]);
  };

  const handleClearExam = (id) => {
    const examToRemove = exams.find((e) => e.id === id);
    if (examToRemove) {
      const newXp = xp + XP_PER_CLEAR;
      const newGold = gold + GOLD_PER_CLEAR;

      if (newXp >= XP_TO_LEVEL_UP) {
        setLevel((l) => l + 1);
        setXp(newXp - XP_TO_LEVEL_UP);
        showToast('LEVEL UP! You reached level ' + (level + 1) + '!');
      } else {
        setXp(newXp);
        showToast('+' + XP_PER_CLEAR + ' XP  +' + GOLD_PER_CLEAR + ' Gold');
      }

      setGold(newGold);
      setCompletedCount((prev) => prev + 1);
      handleDeleteExam(id);
    }
  };

  const handleDeleteExam = (id) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  const handleTriggerGame = (id) => {
    setCurrentGameId(id);
    setShowGame(true);
  };

  // Updated: When completing the game (success), we trigger the deletion and award XP/Coins.
  const handleCloseGame = (success) => {
    setShowGame(false);
    if (success && currentGameId) {
      handleClearExam(currentGameId);
      alert('Congratulations! Exam completed and cleared!');
    }
    setCurrentGameId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !subject || !date || !time || !room) return;
    handleAddExam({
      id: crypto.randomUUID(),
      name,
      subject,
      date,
      time,
      room,
    });
    setName('');
    setSubject('');
    setDate('');
    setTime('');
    setRoom('');
    setShowForm(false);
  };

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
          <span className="stat-label">
            XP — {xp} / {XP_TO_LEVEL_UP}
          </span>
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
          <span className="stat-value">{completedCount}</span>
        </div>
      </div>

      <main className="task-board" style={{ marginTop: '1.5rem' }}>
        <div className="task-column" style={{ flex: '1', minWidth: '300px', background: 'var(--card-bg)' }}>
          <div className="col-header">
            <span className="col-title" style={{ fontSize: '1.1rem', fontFamily: 'inherit' }}>
              Exam Countdown
            </span>
          </div>

          <div style={{ padding: '1.2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <button className="form-save-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Add New Exam'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="add-task-form">
                <input className="add-task-input" type="text" placeholder="Exam Title" value={name} onChange={(e) => setName(e.target.value)} required />
                <input className="add-task-input" type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />

                <label className="add-task-input" style={{ border: 'none', background: 'transparent', color: '#666', paddingBottom: '2px' }}>
                  Date:
                </label>
                <input className="add-task-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

                <label className="add-task-input" style={{ border: 'none', background: 'transparent', color: '#666', paddingBottom: '2px' }}>
                  Time:
                </label>
                <input className="add-task-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />

                <input className="add-task-input" type="text" placeholder="Room" value={room} onChange={(e) => setRoom(e.target.value)} required />
                <button className="form-save-btn" type="submit">
                  Save Exam
                </button>
              </form>
            )}

            <div className="color-legend" style={{ marginTop: '1.2rem', fontSize: '0.85rem' }}>
              <p>
                <strong>Status Legends:</strong>
              </p>
              <p>
                <span className="red-underline">Red:</span> Intense & Urgent (1 day or less)
              </p>
              <p>
                <span className="orange-underline">Orange:</span> Moderately Difficult (1-3 days)
              </p>
              <p>
                <span className="yellow-underline">Yellow:</span> Fairly Ready (4-7 days)
              </p>
              <p>
                <span className="green-underline">Green:</span> Excellent & Ready (8+ days)
              </p>
            </div>
          </div>
        </div>

        <div className="task-column" style={{ flex: '1.5', minWidth: '350px', background: 'var(--card-bg)' }}>
          <div className="col-header">
            <span className="col-title" style={{ fontSize: '1.1rem', fontFamily: 'inherit' }}>
              Scheduled Exams
            </span>
          </div>

          <div className="col-tasks" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {exams.length === 0 && <p className="col-empty">No exams scheduled.</p>}
            {exams.map((ex) => (
              <div key={ex.id} className="task-card" style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div>
                  <span className={`task-name ${getStatusColor(ex.date)}`}>{ex.name}</span>
                  <div className="task-meta">
                    <span className="task-subject">{ex.subject}</span>
                    <span className="xp-tag">
                      {ex.date} {ex.time}
                    </span>
                    <span className="gold-tag">Room: {ex.room}</span>
                  </div>
                </div>
                <div>
                  <button
                    className="form-save-btn"
                    style={{ marginRight: '0.4rem', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                    onClick={() => handleClearExam(ex.id)}
                  >
                    Clear
                  </button>
                  <button
                    className="task-delete"
                    style={{ backgroundColor: 'var(--accent-red)', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                    onClick={() => handleTriggerGame(ex.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showGame && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '8px' }}>
            {/* The onClose trigger completes the game and rewards gold */}
            <DinoGame onClose={() => handleCloseGame(true)} />
            <button
              onClick={() => handleCloseGame(false)}
              style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', cursor: 'pointer' }}
            >
              Quit Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}