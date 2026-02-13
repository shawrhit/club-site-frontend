import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BlogDetailPage from './components/BlogDetailPage';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import RoadmapsPage from './pages/RoadmapsPage';
import RoadmapDetailPage from './pages/RoadmapDetailPage';
import TeamPage from './pages/TeamPage';
import TeamMemberPage from './pages/TeamMemberPage';
import TagPage from './pages/TagPage';
import Footer from './components/Footer';
import DevPage from './pages/DevPage';

function App() {
  return (
    <>
      <div className="background-container">
        <div className="background-gradient"></div>
      </div>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:postId" element={<BlogDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/roadmaps" element={<RoadmapsPage />} />
        <Route path="/roadmaps/:roadmapId" element={<RoadmapDetailPage />} />
        <Route path="/tags/:slug" element={<TagPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/team/:memberId" element={<TeamMemberPage />} />
        <Route path="/dev" element={<DevPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
