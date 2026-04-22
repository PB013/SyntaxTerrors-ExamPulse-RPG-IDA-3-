import React, { useState } from 'react';
import './App.css';

import CharacterCard from './CharacterCard';
import WelcomeCard from './WelcomeCard';

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
      setCharacter((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(file)
      }));
    }
  };

  const saveCharacter = () => {
    
    setDescription(desc);
    alert('Character Data Saved locally!');
  };

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
              <img src={character.avatar} alt="Character" />
            ) : (
              <span className="avatar-label">
                Placeholder<br />of character
              </span>
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

          <CharacterCard
            character={character}
            classes={classes}
            ranks={ranks}
            handleInputChange={handleInputChange}
            setCharacter={setCharacter}
            saveCharacter={saveCharacter}
          />
        </div>

        <WelcomeCard />
      </main>
    </div>
  );
};

export default App;