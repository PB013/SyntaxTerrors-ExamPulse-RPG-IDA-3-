import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './App.css';

function Tasks() {
  const [task, setTask] = useState('');
  const [note, setNote] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // LOAD from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  // SAVE to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();

    if (!task) return;

    if (editingId) {
      // UPDATE existing task
      setTasks(tasks.map(t =>
        t.id === editingId
          ? { ...t, task, note, deadline }
          : t
      ));
      setEditingId(null);
    } else {
      // ADD new task
      const newTask = {
        id: Date.now(),
        task,
        note,
        deadline,
      };
      setTasks([...tasks, newTask]);
    }

    // Clear inputs
    setTask('');
    setNote('');
    setDeadline('');
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleEdit = (t) => {
    setTask(t.task);
    setNote(t.note);
    setDeadline(t.deadline);
    setEditingId(t.id);
  };

  return (
    <div className="task-page">
      <Navbar />
      <main>

        <h2>Task List</h2>
        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t.id} className="task-item">
              <strong>{t.task}</strong>
              {t.note && <p>{t.note}</p>}
              {t.deadline && <small>Due: {t.deadline}</small>}

              <div className="task-actions">
                <button onClick={() => handleEdit(t)}>Edit</button>
                <button onClick={() => handleDelete(t.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>

        <h2>{editingId ? 'Edit Task' : 'Add Task'}</h2>

        <form onSubmit={handleAddTask} className="task-form">
          <h3>Task Title</h3>
          <input
            type="text"
            placeholder="APTECH lesson 1 Review"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />

          <h3>Details:</h3>
          <textarea
            placeholder="Long quiz next meeting"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <h3>Deadline</h3>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button type="submit">
            {editingId ? 'Update Task' : 'Add Task'}
          </button>
        </form>

      </main>
    </div>
  );
}

export default Tasks;
