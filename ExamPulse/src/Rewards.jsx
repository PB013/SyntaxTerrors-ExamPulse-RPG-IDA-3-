import { useState } from 'react';

export default function Rewards({ gold, onUpdateGold }) {
  const [shopItems] = useState([
    { id: 1, name: 'Double XP Boost', cost: 30 },
    { id: 2, name: 'Golden Pen', cost: 50 },
    { id: 3, name: 'Exam Skipper', cost: 100 },
  ]);

  const [inventory, setInventory] = useState([]);

  const buyItem = (item) => {
    if (gold >= item.cost) {
      onUpdateGold(gold - item.cost);
      setInventory([...inventory, { ...item, uniqueId: crypto.randomUUID() }]);
    } else {
      alert('Not enough gold!');
    }
  };

  const sellItem = (item) => {
    onUpdateGold(gold + Math.floor(item.cost * 0.8)); // 80% refund value
    setInventory(inventory.filter(i => i.uniqueId !== item.uniqueId));
  };

  return (
    <div className="about-card">
      <h2>Rewards Shop</h2>
      <p>Gold Available: <span className="gold-value">{gold} Coins</span></p>

      <h3 style={{ marginTop: '1rem', color: 'var(--navy)' }}>Buy Items</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {shopItems.map(item => (
          <div key={item.id} className="task-card" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{item.name}</span>
            <span className="gold-tag">{item.cost} Gold</span>
            <button className="form-save-btn" style={{ padding: '0.2rem 0.6rem', flex: 'none' }} onClick={() => buyItem(item)}>
              Buy
            </button>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: '1.5rem', color: 'var(--navy)' }}>Your Inventory</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {inventory.length === 0 && <p>Inventory is empty.</p>}
        {inventory.map(item => (
          <div key={item.uniqueId} className="task-card" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{item.name}</span>
            <span className="xp-tag">Sold for {Math.floor(item.cost * 0.8)} Gold</span>
            <button className="form-cancel-btn" style={{ padding: '0.2rem 0.6rem' }} onClick={() => sellItem(item)}>
              Sell
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}