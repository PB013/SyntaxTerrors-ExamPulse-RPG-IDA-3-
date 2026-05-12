import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Rewards.css';

const XP_TO_LEVEL_UP = 200;

const SHOP_ITEMS = [
  { 
    id: 'item_about_theme', 
    name: 'Retro Arcade Theme', 
    cost: 45, 
    desc: 'Transforms the About Page look into an old-school arcade cabinet screen template.' 
  },
  { 
    id: 'item_dashboard_gold', 
    name: 'Golden Grid Theme', 
    cost: 100, 
    desc: 'Gives your primary task countdown dashboard panels a premium gold gilded metallic border styling.' 
  },
  { 
    id: 'item_tasks_cyber', 
    name: 'Cyberpunk Task Matrix', 
    cost: 85, 
    desc: 'Overhauls the Tasks dashboard columns with electric neon borders and tech fonts.' 
  },
  { 
    id: 'item_char_theme', 
    name: 'Cosmic Card Theme', 
    cost: 60, 
    desc: 'Transforms the Character Creation interface into a sleek cyberpunk neon design.' 
  }
];

export default function Rewards() {
  // Global Dashboard States synced with ExamCountdown
  const [xp, setXp] = useState(() => Number(localStorage.getItem('exampulse-xp') || 0));
  const [gold, setGold] = useState(() => Number(localStorage.getItem('exampulse-gold') || 0));
  const [level, setLevel] = useState(() => Number(localStorage.getItem('exampulse-level') || 1));
  const [completedCount, setCompletedCount] = useState(() => Number(localStorage.getItem('exampulse-done-today') || 0));
  const [toast, setToast] = useState(null);

  // Inventory State
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('exampulse-inventory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync Global Stats to LocalStorage
  useEffect(() => {
    localStorage.setItem('exampulse-xp', xp);
    localStorage.setItem('exampulse-gold', gold);
    localStorage.setItem('exampulse-level', level);
    localStorage.setItem('exampulse-done-today', completedCount);
  }, [xp, gold, level, completedCount]);

  // Sync Inventory Items to LocalStorage
  useEffect(() => {
    localStorage.setItem('exampulse-inventory', JSON.stringify(inventory));
  }, [inventory]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleBuyItem = (item) => {
    // 🛡️ CHK 1: Check if the exact item type is already present inside the inventory vault
    const isAlreadyOwned = inventory.some((invItem) => invItem.id === item.id);
    if (isAlreadyOwned) {
      showToast(`⚠️ Item already purchased: ${item.name}!`);
      return;
    }

    // 🛡️ CHK 2: Check balance limits
    if (gold < item.cost) {
      showToast('❌ Not enough Gold!');
      return;
    }

    // Deduct and mint item parameters
    setGold((prev) => prev - item.cost);
    
    const purchasedItem = {
      ...item,
      purchaseId: crypto.randomUUID(),
    };
    setInventory((prev) => [...prev, purchasedItem]);
    showToast(`🛒 Purchased ${item.name}!`);
  };

  const handleSellItem = (purchaseId, originalCost, itemName) => {
    const sellValue = Math.ceil(originalCost * 0.6);
    setGold((prev) => prev + sellValue);
    setInventory((prev) => prev.filter((item) => item.purchaseId !== purchaseId));
    showToast(`💰 Sold ${itemName} for +${sellValue} Gold!`);
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
        
        {/* Left Column: Shop Interface */}
        <div className="task-column" style={{ flex: '1.2', minWidth: '320px', background: 'var(--card-bg)' }}>
          <div className="col-header">
            <span className="col-title" style={{ fontSize: '1.1rem', fontFamily: 'inherit' }}>
              Gold Rewards Shop
            </span>
          </div>
          
          <div className="rewards-grid-container">
            {SHOP_ITEMS.map((item) => {
              const isOwned = inventory.some((invItem) => invItem.id === item.id);
              const affordable = gold >= item.cost;
              
              // Conditional dynamic styling logic based on transaction validation states
              let buttonText = 'Buy';
              let buttonClass = 'form-save-btn';
              if (isOwned) {
                buttonText = 'Owned';
                buttonClass = 'form-save-btn owned-item-btn';
              } else if (!affordable) {
                buttonClass = 'form-save-btn insufficient-funds-btn';
              }

              return (
                <div key={item.id} className={`reward-item-card ${isOwned ? 'owned-card' : !affordable ? 'locked-card' : ''}`}>
                  <div className="reward-card-info">
                    <span className="reward-item-title">{item.name}</span>
                    <p className="reward-item-desc">{item.desc}</p>
                  </div>
                  <div className="reward-card-action">
                    <span className="gold-tag" style={{ fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}>
                      Cost: {item.cost} Gold
                    </span>
                    <button 
                      className={buttonClass}
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
                      onClick={() => handleBuyItem(item)}
                      disabled={isOwned} // Disables interaction if already owned
                    >
                      {buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: User Inventory */}
        <div className="task-column" style={{ flex: '1.5', minWidth: '350px', background: 'var(--card-bg)' }}>
          <div className="col-header">
            <span className="col-title" style={{ fontSize: '1.1rem', fontFamily: 'inherit' }}>
              Your Inventory ({inventory.length})
            </span>
          </div>

          <div className="col-tasks" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {inventory.length === 0 && (
              <p className="col-empty" style={{ textAlign: 'center', color: '#666', padding: '2rem 0' }}>
                Your item vault is empty. Complete exams to clear gold!
              </p>
            )}
            
            {inventory.map((invItem) => {
              const currentSellValue = Math.ceil(invItem.cost * 0.6);
              return (
                <div key={invItem.purchaseId} className="task-card" style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div>
                    <span className="task-name yellow-underline">{invItem.name}</span>
                    <div className="task-meta">
                      <span className="task-subject" style={{ color: '#aaa' }}>{invItem.desc}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="xp-tag" style={{ color: 'var(--accent-gold)' }}>
                      +{currentSellValue} G
                    </span>
                    <button
                      className="task-delete"
                      style={{ backgroundColor: 'var(--accent-red)', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                      onClick={() => handleSellItem(invItem.purchaseId, invItem.cost, invItem.name)}
                    >
                      Sell
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
