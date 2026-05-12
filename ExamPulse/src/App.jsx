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
  const [hasPremiumTheme, setHasPremiumTheme] = useState(false);
  const [toast, setToast] = useState(null); 
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

  const triggerSecretGold = () => {
    const currentGold = Number(localStorage.getItem('exampulse-gold') || 0);
    const newGold = currentGold + 50;
    localStorage.setItem('exampulse-gold', newGold);
    setToast('🤫 Secret Code: +50 Gold Added!');
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCharacter((prev) => ({ ...prev, [id]: value }));
  };

  // 🚀 HIGHLY COMPATIBLE IMAGE CONVERTER
  const applyAvatar = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        
        // Update state instantly so it renders right away
        setCharacter((prev) => ({ ...prev, avatar: base64Data }));
        
        // Save to storage safely
        try {
          localStorage.setItem('examPulseAvatar', base64Data);
        } catch (error) {
          console.warn("Image too big for localStorage, displaying locally for this session.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => applyAvatar(e.target.files[0]);

  const handleCircleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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

      {toast && <div className="toast secret-toast">{toast}</div>}

      <main>
        <div className="avatar-zone">
          
          {/* ⚡ THE AVATAR RING (Clicking this opens the file explorer instantly) */}
          <div className="avatar-circle" onClick={handleCircleClick} style={{ cursor: 'pointer' }}>
            {character.avatar ? (
              <img 
                src={character.avatar} 
                alt="Avatar" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',   /* Prevents distortion */
                  borderRadius: '50%',  /* Ensures it stays perfectly round */
                  display: 'block'
                }} 
              />
            ) : (
              // Keeps your exact markup classes intact so CSS styles don't break
              <span className="avatar-label">
                Placeholder<br />of character
              </span>
            )}
            {/* Matches your exact "CHANGE" overlay styling */}
            <div className="change-hint">CHANGE</div>
          </div>

          {}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInput} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />

          {/* Character Card */}
          <div className="char-card">
            <h3 onClick={triggerSecretGold} className="secret-clickable-title" title="Character Creation Card">
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
