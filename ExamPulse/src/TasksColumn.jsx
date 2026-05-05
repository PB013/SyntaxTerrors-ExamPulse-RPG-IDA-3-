import { useState } from 'react';
import TasksCard from './TasksCard';

const TasksColumn = ({ title, tasks, color, onComplete, onDelete, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSubject, setNewSubject] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd({ name: newName.trim(), subject: newSubject.trim() });
    setNewName('');
    setNewSubject('');
    setShowForm(false);
  };

  const activeTasks = tasks.filter(t => !t.done);

  return (
    <div className="task-column">
      <div className="col-header" style={{ borderTopColor: color }}>
        <span className="col-title">{title}</span>
        <span className="col-badge">{activeTasks.length}</span>
        {onAdd && (
          <button className="col-add-btn" onClick={() => setShowForm(f => !f)}>+</button>
        )}
      </div>

      <div className="col-tasks">
        {activeTasks.length === 0 && (
          <p className="col-empty">No tasks yet. Hit + to add one!</p>
        )}
        {activeTasks.map(task => (
          <TasksCard
            key={task.id}
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        ))}
      </div>

      {showForm && (
        <div className="add-task-form">
          <input
            className="add-task-input"
            placeholder="Task name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <input
            className="add-task-input"
            placeholder="Subject (e.g. Math, History)"
            value={newSubject}
            onChange={e => setNewSubject(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <div className="form-actions">
            <button className="form-save-btn" onClick={handleAdd}>Add Task</button>
            <button className="form-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksColumn;