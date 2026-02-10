import React from 'react';
import HeroSection from '../components/HeroSection';
import ProjectsSection from '../components/ProjectsSection';
import BlogSection from '../components/BlogSection';
import EventsSection from '../components/EventsSection';
import RoadmapsSection from '../components/RoadmapsSection';
import TeamSection from '../components/TeamSection';
import TagsSection from '../components/TagsSection';

function HomePage() {
  return (
    <main>
      <HeroSection />
      <ProjectsSection />
      <BlogSection />
      <EventsSection />
      <RoadmapsSection />
      <TeamSection />
      <TagsSection />
    </main>
  );
}

export default HomePage;
