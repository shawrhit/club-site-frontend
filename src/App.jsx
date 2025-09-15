import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage'; // The page you have open in the Canvas
// Import statements for the other pages will go here later
// import ProjectsPage from './pages/ProjectsPage';
// import BlogPage from './pages/BlogPage';

function App() {
  return (
    <Router>
      {/* These components are outside the Routes, so they appear on every page */}
      <div className="background-container">
        <div className="background-gradient"></div>
      </div>
      <Header />

      {/* The Routes component switches between your different pages */}
      <Routes>
        {/* This route renders the HomePage component when the URL is "/" */}
        <Route path="/" element={<HomePage />} />

        {/* We will add more routes here for the "See More" pages */}
        {/* <Route path="/projects" element={<ProjectsPage />} /> */}
        {/* <Route path="/blog" element={<BlogPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

