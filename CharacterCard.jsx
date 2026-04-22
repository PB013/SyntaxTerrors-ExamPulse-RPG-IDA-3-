import React from 'react';

const CharacterCard = ({
  character,
  classes,
  ranks,
  handleInputChange,
  setCharacter,
  saveCharacter
}) => {
  return (
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
            {ranks.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
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
  );
};

export default CharacterCard;