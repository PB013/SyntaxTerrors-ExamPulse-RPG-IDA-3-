import React, { useState, useRef } from 'react';
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
  const fileInputRef = useRef(null);

  const classes = ['Scholar', 'Mage', 'Warrior', 'Rogue', 'Bard'];
  const ranks = ['Novice', 'Apprentice', 'Journeyman', 'Expert', 'Master'];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCharacter((prev) => ({ ...prev, [id]: value }));
  };

  const applyAvatar = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Save as base64 so it persists on refresh
        setCharacter((prev) => ({ ...prev, avatar: e.target.result }));
        localStorage.setItem('examPulseAvatar', e.target.result);
      };
      reader.readAsDataURL(file);
      setShowAvatarModal(false);
    }
  };

  const handleFileInput = (e) => applyAvatar(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    applyAvatar(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  // Load saved avatar on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('examPulseAvatar');
    if (saved) setCharacter((prev) => ({ ...prev, avatar: saved }));
  }, []);

  const saveCharacter = () => {
    const desc = `${character.name} is a Level ${character.level} ${character.charClass} (${character.rank}) specializing in ${character.specialty || 'General Studies'}.`;
    setDescription(desc);
    alert('Character Data Saved locally!');
  };

  return (
    <div>
      <Navbar />
      <main>
        {/* LEFT COLUMN */}
        <div className="avatar-zone">

          {/* Avatar Circle */}
          <div
            className="avatar-circle"
            onClick={() => setShowAvatarModal(true)}
            title="Click to change character image"
          >
            {character.avatar ? (
              <img src={character.avatar} alt="Character" style={{ display: 'block' }} />
            ) : (
              <span className="avatar-label">Placeholder<br />of character</span>
            )}
            <div className="change-hint">CHANGE</div>
          </div>

          {/* Avatar Upload Modal */}
          {showAvatarModal && (
            <div className="avatar-modal-overlay" onClick={() => setShowAvatarModal(false)}>
              <div className="avatar-modal" onClick={(e) => e.stopPropagation()}>
                <h4 className="avatar-modal-title">Upload Character Image</h4>

                {/* Drag & Drop Zone */}
                <div
                  className={`avatar-drop-zone ${dragOver ? 'drag-active' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current.click()}
                >
                  {dragOver ? (
                    <p>Drop it!</p>
                  ) : (
                    <>
                      <p>Drag & drop an image here</p>
                      <span>or click to browse</span>
                    </>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileInput}
                />

                {/* Preview */}
                {character.avatar && (
                  <div className="avatar-preview">
                    <p>Current:</p>
                    <img src={character.avatar} alt="Preview" />
                    <button
                      className="avatar-remove-btn"
                      onClick={() => {
                        setCharacter((prev) => ({ ...prev, avatar: null }));
                        localStorage.removeItem('examPulseAvatar');
                        setShowAvatarModal(false);
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}

                <button className="avatar-modal-close" onClick={() => setShowAvatarModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Rest of char card unchanged */}
          <div className="char-card">
            <h3>Character Creation Card</h3>
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

        {/* RIGHT COLUMN */}
        <div className="description-panel">
          <p>{description || 'Your character description will appear here after saving.'}</p>
        </div>
      </main>
    </div>
  );
};

export default App;