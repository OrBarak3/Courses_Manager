// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // Import your pages
// import Home from './Home'; 
// import Python from './pages/python';
// import StatisticalInference from './pages/Statistical_Inference';
// import EngineeringEconomics from './pages/Engineering_Economics';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Home route */}
//         <Route path="/" element={<Home />} />
        
//         {/* Course routes */}
//         <Route path="/course/python" element={<Python />} />
//         <Route path="/course/statistical-inference" element={<StatisticalInference />} />
//         <Route path="/course/engineering-economics" element={<EngineeringEconomics />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import CoursePage from './pages/CoursePage'; // A generic course page for all courses

function App() {
  return (
    <Router>
      <Routes>
        {/* Home screen */}
        <Route path="/" element={<Home />} />
        {/* Dynamic route: any course name goes to CoursePage */}
        <Route path="/course/:courseName" element={<CoursePage />} />
      </Routes>
    </Router>
  );
}

export default App;
