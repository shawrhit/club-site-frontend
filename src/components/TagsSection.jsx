import React from 'react';
import Section from './Section';

const exploreTags = ["Arduino", "Raspberry Pi", "IoT", "Robotics", "AI / ML", "PCB Design", "Web Development", "3D Printing", "Drones", "Signal Processing"];

function TagsSection() {
  return (
    <Section
      id="tags"
      eyebrow="EXPLORE"
      title="Explore Topics"
      subtitle="Dive into the topics that interest you the most. Find related projects, blog posts, and resources."
    >
        <div className="explore-tags-container">
            {exploreTags.map(tag => (
                <a href="#" key={tag} className="explore-tag">{tag}</a>
            ))}
        </div>
    </Section>
  );
}

export default TagsSection;

