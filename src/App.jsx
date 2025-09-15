import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import ProjectsPage from './pages/ProjectsPage'; // Import new page
import RoadmapsPage from './pages/RoadmapsPage'; // Import new page
import TeamPage from './pages/TeamPage';       // Import new page

function App() {
  return (
    <>
      {/* These shared elements will appear on every page */}
      <div className="background-container">
        <div className="background-gradient"></div>
      </div>
      <Header />

      {/* The Routes component will render the correct page based on the URL */}
      <Routes>
        {/* Main landing page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Dedicated pages for each section */}
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/roadmaps" element={<RoadmapsPage />} />
        <Route path="/team" element={<TeamPage />} />
      </Routes>
    </>
  );
}

export default App;

