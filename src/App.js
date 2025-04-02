import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Python from './pages/python';
import StatisticalInference from './pages/Statistical_Inference';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/python" element={<Python />} />
        <Route path="/course/statistical-inference" element={<StatisticalInference />} />
      </Routes>
    </Router>
  );
}

export default App;
