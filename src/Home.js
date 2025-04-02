// src/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState('');

  // Subscribe to the "courses" collection in real time
  useEffect(() => {
    const coursesCollection = collection(db, "courses");
    const unsubscribe = onSnapshot(coursesCollection, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesData);
    });
    return () => unsubscribe();
  }, []);

  // Add a new course to Firestore
  const handleAddCourse = async () => {
    if (!newCourse.trim()) return;
    try {
      await addDoc(collection(db, "courses"), { name: newCourse });
      setNewCourse('');
      // Navigate to the new course's page dynamically
      navigate(`/course/${newCourse}`);
    } catch (error) {
      console.error("Error adding course: ", error);
    }
  };

  // Remove a course from Firestore
  const handleRemoveCourse = async (course) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${course.name}"?`);
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "courses", course.id));
      } catch (error) {
        console.error("Error deleting course: ", error);
      }
    }
  };

  // Dynamic navigation for any course name
  const goToCoursePage = (course) => {
    navigate(`/course/${course.name}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 My Courses</h1>

      <div style={styles.cardGrid}>
        {courses.map(course => (
          <div key={course.id} style={styles.card}>
            <button
              style={styles.deleteButton}
              onClick={() => handleRemoveCourse(course)}
              title="Remove Course"
            >
              ❌
            </button>
            <h2
              style={styles.cardTitle}
              onClick={() => goToCoursePage(course)}
            >
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
          onChange={e => setNewCourse(e.target.value)}
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
    marginBottom: '30px',
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
