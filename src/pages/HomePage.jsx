import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import ProjectsSection from '../components/ProjectsSection';
import BlogSection from '../components/BlogSection';
import EventsSection from '../components/EventsSection';
import RoadmapsSection from '../components/RoadmapsSection';
import TeamSection from '../components/TeamSection';
import TagsSection from '../components/TagsSection';
import { loadLandingData } from '../utils/landingData';

function HomePage() {
  const [landingData, setLandingData] = useState({
    tags: [],
    tagsPopular: [],
    blogs: [],
    projects: [],
    events: [],
    roadmaps: [],
    team: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await loadLandingData({ signal: controller.signal });
        setLandingData(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return (
    <main>
      <HeroSection />
      <ProjectsSection projects={landingData.projects} loading={loading} />
      <BlogSection blogPosts={landingData.blogs} loading={loading} />
      <EventsSection events={landingData.events} loading={loading} />
      <RoadmapsSection roadmaps={landingData.roadmaps} loading={loading} />
      <TeamSection teamMembers={landingData.team} loading={loading} />
      <TagsSection tags={landingData.tags} loading={loading} error={error} />
    </main>
  );
}

export default HomePage;
