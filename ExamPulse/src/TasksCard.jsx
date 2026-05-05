const TasksCard = ({ task, onComplete, onDelete }) => {
    return (
      <div className={`task-card ${task.done ? 'task-done' : ''}`}>
        <button
          className={`task-check ${task.done ? 'checked' : ''}`}
          onClick={() => !task.done && onComplete(task.id)}
          aria-label="Complete task"
        />
        <div className="task-info">
          <span className="task-name">{task.name}</span>
          <div className="task-meta">
            <span className="task-subject">{task.subject}</span>
            <span className="xp-tag">+{task.xp} XP</span>
            <span className="gold-tag">+{task.gold} Gold</span>
          </div>
        </div>
        <button className="task-delete" onClick={() => onDelete(task.id)} aria-label="Delete task">✕</button>
      </div>
    );
  };
  
  export default TasksCard;