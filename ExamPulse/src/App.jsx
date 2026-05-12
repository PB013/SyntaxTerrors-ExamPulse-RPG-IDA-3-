import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import './App.css';

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
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [hasPremiumTheme, setHasPremiumTheme] = useState(false);
  const [toast, setToast] = useState(null); // Added toast tracker for sneaky confirmation
  const fileInputRef = useRef(null);

  const classes = ['Scholar', 'Mage', 'Warrior', 'Rogue', 'Bard'];
  const ranks = ['Novice', 'Apprentice', 'Journeyman', 'Expert', 'Master'];

  useEffect(() => {
    try {
      const savedInventory = localStorage.getItem('exampulse-inventory');
      if (savedInventory) {
        const inventoryArray = JSON.parse(savedInventory);
        const ownsTheme = inventoryArray.some(item => item.id === 'item_char_theme');
        setHasPremiumTheme(ownsTheme);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // --- 🤫 THE SECRET CHEAT FUNCTION ---
  const triggerSecretGold = () => {
    const currentGold = Number(localStorage.getItem('exampulse-gold') || 0);
    const newGold = currentGold + 50;
    
    // Save directly to localStorage so the Reward Shop reads it instantly
    localStorage.setItem('exampulse-gold', newGold);
    
    // Flash a temporary hidden toast alert
    setToast('🤫 Secret Code: +50 Gold Added!');
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCharacter((prev) => ({ ...prev, [id]: value }));
  };

  const applyAvatar = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCharacter((prev) => ({ ...prev, avatar: e.target.result }));
        localStorage.setItem('examPulseAvatar', e.target.result);
      };
      reader.readAsDataURL(file);
      setShowAvatarModal(false);
    }
  };

  const handleFileInput = (e) => applyAvatar(e.target.files[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); applyAvatar(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  useEffect(() => {
    const saved = localStorage.getItem('examPulseAvatar');
    if (saved) setCharacter((prev) => ({ ...prev, avatar: saved }));
  }, []);

  const saveCharacter = () => {
    const desc = `${character.name} is a Level ${character.level} ${character.charClass} (${character.rank}) specializing in ${character.specialty || 'General Studies'}.`;
    setDescription(desc);
    alert('Character Data Saved locally!');
  };

  return (
    <div className={`character-container ${hasPremiumTheme ? 'cosmic-unlocked' : ''}`}>
      <Navbar />

      {/* Secret Toast Feed */}
      {toast && <div className="toast secret-toast">{toast}</div>}

      <main>
        <div className="avatar-zone">
          <div className="avatar-circle" onClick={() => setShowAvatarModal(true)}>
            {character.avatar ? <img src={character.avatar} alt="Character" /> : <span className="avatar-label">Placeholder<br />of character</span>}
            <div className="change-hint">CHANGE</div>
          </div>

          {/* Avatar Upload Modal Code Remains Intact... */}

          {/* Character Card */}
          <div className="char-card">
            
            {/* 🎯 THE HIDDEN BUTTON: Clicking this text triggers the gold cheat */}
            <h3 
              onClick={triggerSecretGold} 
              className="secret-clickable-title"
              title="Character Creation Card"
            >
              Character Creation Card
            </h3>

            <div className="char-field">
              <label>Character Name</label>
              <input type="text" id="name" placeholder="Enter name…" value={character.name} onChange={handleInputChange} />
            </div>
            <div className="char-field">
              <label>Class</label>
              <div className="class-chips">
                {classes.map((c) => (
                  <span key={c} className={`chip ${character.charClass === c ? 'active' : ''}`} onClick={() => setCharacter({ ...character, charClass: c })}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="stat-row">
              <div className="char-field">
                <label>Level</label>
                <input type="number" id="level" min="1" max="99" value={character.level} onChange={handleInputChange} />
              </div>
              <div className="char-field">
                <label>Rank</label>
                <select id="rank" value={character.rank} onChange={handleInputChange}>
                  {ranks.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="char-field">
              <label>Specialty / Subject</label>
              <input type="text" id="specialty" placeholder="e.g. Mathematics, History…" value={character.specialty} onChange={handleInputChange} />
            </div>
            <button className="char-save-btn" onClick={saveCharacter}>Save Character</button>
          </div>
        </div>

        <div className="description-panel">
          <p>{description || 'Your character description will appear here after saving.'}</p>
        </div>
      </main>
    </div>
  );
};

export default App;
