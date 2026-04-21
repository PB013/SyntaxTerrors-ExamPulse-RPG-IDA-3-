import React, { useState } from 'react';
import './App.css';


//change to seperate charactercard
const App = () => {
  const [character, setCharacter] = useState({
    name: '',
    charClass: 'Scholar',
    level: 1,
    rank: 'Novice',
    specialty: '',
    avatar: null,
  });

  const [description, setDescription] = useState('');

  const classes = ['Scholar', 'Mage', 'Warrior', 'Rogue', 'Bard'];
  const ranks = ['Novice', 'Apprentice', 'Journeyman', 'Expert', 'Master'];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCharacter((prev) => ({ ...prev, [id]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCharacter((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  const saveCharacter = () => {
    const desc = `${character.name} is a Level ${character.level} ${character.charClass} (${character.rank}) specializing in ${character.specialty || 'General Studies'}.`;
    setDescription(desc);
    alert('Character Data Saved locally!');
  };


  //mainframe
  return (
    <div className="app-container">
      <nav>
        <span className="nav-brand">ExamPulse RPG</span>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#exam">Exam Countdown</a></li>
          <li><a href="#tasks">Tasks</a></li>
          <li><a href="#rewards">Rewards</a></li>
        </ul>
      </nav>

      <main>
        {/* LEFT COLUMN */}
        <div className="avatar-zone">
          <div 
            className="avatar-circle" 
            onClick={() => document.getElementById('avatar-upload').click()}
            title="Click to change character image"
          >
            {character.avatar ? (
              <img src={character.avatar} alt="Character" id="avatarImg" />
            ) : (
              <span className="avatar-label">Placeholder<br/>of character</span>
            )}
            <div className="change-hint">CHANGE</div>
          </div>
          <input 
            type="file" 
            id="avatar-upload" 
            hidden 
            accept="image/*" 
            onChange={handleAvatarUpload} 
          />

          <div className="char-card">
            <h3>Character Creation Card</h3>

            <div className="char-field">
              <label>Character Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="Enter name…" 
                value={character.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="char-field">
              <label>Class</label>
              <div className="class-chips">
                {classes.map((c) => (
                  <span 
                    key={c}
                    className={`chip ${character.charClass === c ? 'active' : ''}`}
                    onClick={() => setCharacter({ ...character, charClass: c })}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="stat-row">
              <div className="char-field">
                <label>Level</label>
                <input 
                  type="number" 
                  id="level" 
                  min="1" 
                  max="99" 
                  value={character.level}
                  onChange={handleInputChange}
                />
              </div>
              <div className="char-field">
                <label>Rank</label>
                <select id="rank" value={character.rank} onChange={handleInputChange}>
                  {ranks.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="char-field">
              <label>Specialty / Subject</label>
              <input 
                type="text" 
                id="specialty" 
                placeholder="e.g. Mathematics, History…" 
                value={character.specialty}
                onChange={handleInputChange}
              />
            </div>

            <button className="char-save-btn" onClick={saveCharacter}>
              Save Character
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="description-panel">
          <p id="descriptionText">{description}</p>
        </div>
      </main>
    </div>
  );
};

export default App;
