import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([
    { id: '1', name: 'פייתון' },
    { id: '2', name: 'הסקה סטטיסטית' },
    { id: '3', name: 'כלכלה הנדסית' },
    { id: '4', name: 'חדו"א 2' },
    { id: '5', name: 'הסתברויות' },
    { id: '6', name: 'מד"ר' },
  ]);

  const [newCourse, setNewCourse] = useState('');

  const handleAddCourse = () => {
    if (!newCourse.trim()) return;
    const newId = Date.now().toString();
    setCourses([...courses, { id: newId, name: newCourse }]);
    setNewCourse('');
  };

  const handleRemoveCourse = (course) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${course.name}"?`);
    if (confirmDelete) {
      setCourses(courses.filter(c => c.id !== course.id));
    }
  };

  const goToCoursePage = (course) => {
    if (course.name === 'פייתון') {
      navigate('/course/python');
    } else if (course.name === 'הסקה סטטיסטית') {
      navigate('/course/statistical-inference');
    } else {
      alert(`No page created yet for: ${course.name}`);
    }
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
