// src/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';

export default function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState('');
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  // Fetch courses and tasks
  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'courses');
      const unsubscribe = onSnapshot(coursesCollection, async (snapshot) => {
        const courseList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseList);

        // Fetch upcoming tasks for all courses
        let allUpcomingTasks = [];

        for (let course of courseList) {
          const tasksSnap = await getDocs(collection(db, 'courses', course.id, 'tasks'));
          const today = new Date();
          const weekFromNow = new Date();
          weekFromNow.setDate(today.getDate() + 7);

          tasksSnap.forEach(taskDoc => {
            const task = taskDoc.data();
            if (task.date) {
              const taskDate = new Date(task.date);
              if (taskDate >= today && taskDate <= weekFromNow) {
                allUpcomingTasks.push({
                  ...task,
                  courseName: course.name,
                  date: formatDateToIsraeli(task.date),
                });
              }
            }
          });
        }

        setUpcomingTasks(allUpcomingTasks);
      });

      return () => unsubscribe();
    };

    fetchCourses();
  }, []);

  const handleAddCourse = async () => {
    if (!newCourse.trim()) return;
    try {
      await addDoc(collection(db, 'courses'), { name: newCourse });
      setNewCourse('');
      navigate(`/course/${newCourse}`);
    } catch (error) {
      console.error('Error adding course: ', error);
    }
  };

  const handleRemoveCourse = async (course) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${course.name}"?`
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'courses', course.id));
      } catch (error) {
        console.error('Error deleting course: ', error);
      }
    }
  };

  const goToCoursePage = (course) => {
    navigate(`/course/${course.name}`);
  };

  const formatDateToIsraeli = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 My Courses</h1>

      {upcomingTasks.length > 0 && (
        <div style={styles.reminderBox}>
          <h2 style={styles.reminderTitle}>⏰ Tasks in the Next 7 Days</h2>
          {upcomingTasks.map((task, index) => (
            <div key={index} style={styles.reminderItem}>
              <strong>{task.courseName}:</strong> {task.title} – {task.date} {task.time && `at ${task.time}`}
            </div>
          ))}
        </div>
      )}

      <div style={styles.cardGrid}>
        {courses.map((course) => (
          <div key={course.id} style={styles.card}>
            <button
              style={styles.deleteButton}
              onClick={() => handleRemoveCourse(course)}
              title="Remove Course"
            >
              ❌
            </button>
            <h2 style={styles.cardTitle} onClick={() => goToCoursePage(course)}>
              {course.name}
            </h2>
          </div>
        ))}
      </div>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Enter new course"
          value={newCourse}
          onChange={(e) => setNewCourse(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAddCourse} style={styles.button}>
          ➕ Add Course
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
    textAlign: 'center',
  },
  title: {
    fontSize: '36px',
    marginBottom: '20px',
  },
  reminderBox: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeeba',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '30px',
    textAlign: 'left',
  },
  reminderTitle: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  reminderItem: {
    marginBottom: '8px',
    fontSize: '16px',
  },
  cardGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  card: {
    position: 'relative',
    backgroundColor: '#f8f9fa',
    padding: '30px 20px 20px',
    borderRadius: '12px',
    width: '200px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  cardTitle: {
    fontSize: '20px',
    margin: 0,
    cursor: 'pointer',
  },
  deleteButton: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    padding: '4px 8px',
    fontSize: '12px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '200px',
  },
  button: {
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
