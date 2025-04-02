// src/pages/CoursePage.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// 1. Define the mapping up top
const emojiMap = {
  'פייתון': '🐍',
  'הסקה סטטיסטית': '📊',
  'כלכלה הנדסית': '💰',
  'חדו"א 2': '🔢',
  'הסתברות': '❓',
  'מד"ר': '🔬',
};

export default function CoursePage() {
  const { courseName } = useParams();
  const navigate = useNavigate();

  // 2. Pick an emoji or default
  const chosenEmoji = emojiMap[courseName] || '📘';

  // States
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleReturnHome = () => navigate('/');

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;

    if (editingTaskId) {
      setTasks(tasks.map(task =>
        task.id === editingTaskId
          ? { ...task, title: taskTitle, date: taskDate, time: taskTime }
          : task
      ));
      setEditingTaskId(null);
    } else {
      const newTask = {
        id: Date.now().toString(),
        title: taskTitle,
        date: taskDate,
        time: taskTime,
      };
      setTasks([...tasks, newTask]);
    }

    setTaskTitle('');
    setTaskDate('');
    setTaskTime('');
  };

  const handleEdit = (task) => {
    setTaskTitle(task.title);
    setTaskDate(task.date);
    setTaskTime(task.time);
    setEditingTaskId(task.id);
  };

  const handleRemove = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={handleReturnHome} style={styles.homeButton}>Home</button>
      
      {/* 3. Display the chosen emoji with the course name */}
      <h1 style={styles.title}>
        {chosenEmoji} {courseName}
      </h1>

      {/* Tasks list... */}
      <div style={styles.taskList}>
        {tasks.map(task => (
          <div key={task.id} style={styles.taskItem}>
            <div>
              <strong>{task.title}</strong><br />
              <small>{task.date} {task.time}</small>
            </div>
            <div style={styles.buttonGroup}>
              <button onClick={() => handleEdit(task)} style={styles.editBtn}>Edit</button>
              <button onClick={() => handleRemove(task.id)} style={styles.deleteBtn}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit form... */}
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Task title"
          value={taskTitle}
          onChange={e => setTaskTitle(e.target.value)}
          style={styles.input}
        />
        <input
          type="date"
          value={taskDate}
          onChange={e => setTaskDate(e.target.value)}
          style={styles.input}
        />
        <input
          type="time"
          value={taskTime}
          onChange={e => setTaskTime(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAddTask} style={styles.button}>
          {editingTaskId ? '💾 Save Changes' : '➕ Add Task'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  homeButton: {
    marginBottom: '20px',
    padding: '8px 14px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  taskList: {
    marginBottom: '30px',
  },
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    padding: '6px 10px',
    backgroundColor: '#ffc107',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 10px',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
