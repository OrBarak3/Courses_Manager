// src/pages/CoursePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';

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
  const chosenEmoji = emojiMap[courseName] || '📘';

  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'courses'), (snapshot) => {
      snapshot.forEach(docSnap => {
        if (docSnap.data().name === courseName) {
          const tasksRef = collection(doc(db, 'courses', docSnap.id), 'tasks');
          onSnapshot(tasksRef, (tasksSnap) => {
            const taskData = tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(taskData);
          });
        }
      });
    });
    return () => unsubscribe();
  }, [courseName]);

  const handleReturnHome = () => navigate('/');

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;

    const courseQuery = await getDocs(collection(db, 'courses'));
    courseQuery.forEach(async (docSnap) => {
      if (docSnap.data().name === courseName) {
        const courseRef = doc(db, 'courses', docSnap.id);
        const tasksRef = collection(courseRef, 'tasks');

        if (editingTaskId) {
          const taskRef = doc(tasksRef, editingTaskId);
          await updateDoc(taskRef, {
            title: taskTitle,
            date: taskDate,
            time: taskTime,
          });
          setEditingTaskId(null);
        } else {
          await addDoc(tasksRef, {
            title: taskTitle,
            date: taskDate,
            time: taskTime,
          });
        }

        setTaskTitle('');
        setTaskDate('');
        setTaskTime('');
      }
    });
  };

  const handleEdit = (task) => {
    setTaskTitle(task.title);
    setTaskDate(task.date);
    setTaskTime(task.time);
    setEditingTaskId(task.id);
  };

  const handleRemove = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    const courseQuery = await getDocs(collection(db, 'courses'));
    courseQuery.forEach(async courseDoc => {
      if (courseDoc.data().name === courseName) {
        const taskRef = doc(db, 'courses', courseDoc.id, 'tasks', id);
        await deleteDoc(taskRef);
      }
    });
  };

  return (
    <div style={styles.container}>
      <button onClick={handleReturnHome} style={styles.homeButton}>Home</button>

      <h1 style={styles.title}>
        {chosenEmoji} {courseName}
      </h1>

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

      <div style={styles.form}>
        <label style={styles.label}>📌 Task Title</label>
        <input
          type="text"
          placeholder="Enter a task..."
          value={taskTitle}
          onChange={e => setTaskTitle(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>📅 Due Date</label>
        <input
          type="date"
          value={taskDate}
          onChange={e => setTaskDate(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>⏰ Time</label>
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
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
    marginTop: '6px',
    textAlign: 'left',
  },
};
