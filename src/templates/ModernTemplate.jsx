import './ModernTemplate.css';

export default function ModernTemplate({ data }) {
  const { profile, skills, projects, education, socialLinks, experience, certifications } = data;

  return (
    <div className="tmpl-modern">
      {/* Dynamic Background */}
      <div className="tmpl-modern-bg-elements">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <nav className="tmpl-modern-nav">
        <div className="tmpl-modern-logo">
          {profile.name ? profile.name.split(' ').map(n => n[0]).join('') : 'P'}
        </div>
        <div className="tmpl-modern-nav-links">
          <a href="#about">About</a>
          {projects.length > 0 && <a href="#projects">Projects</a>}
          {skills.length > 0 && <a href="#skills">Skills</a>}
        </div>
      </nav>

      <section id="about" className="tmpl-modern-hero">
        <div className="tmpl-modern-hero-content">
          <div className="tmpl-modern-badge">Available for projects</div>
          <h1 className="tmpl-modern-name">
            I'm <span className="gradient-text">{profile.name || 'Your Name'}</span>
          </h1>
          <p className="tmpl-modern-title">{profile.title || 'Creative Developer & Designer'}</p>
          <p className="tmpl-modern-bio">
            {profile.bio || 'Crafting digital experiences that merge functionality with modern aesthetics. Focused on building clean, impactful, and user-centric solutions.'}
          </p>
          <div className="tmpl-modern-hero-actions">
            <a href={`mailto:${profile.email}`} className="btn-modern-primary">Get in touch</a>
            <div className="tmpl-modern-socials">
              {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-icon">GH</a>}
              {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon">IN</a>}
              {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-icon">TW</a>}
            </div>
          </div>
        </div>
        <div className="tmpl-modern-hero-image">
          <div className="image-frame">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} />
            ) : (
              <div className="avatar-fallback">{profile.name ? profile.name.charAt(0) : '?'}</div>
            )}
          </div>
        </div>
      </section>

      {skills.length > 0 && (
        <section id="skills" className="tmpl-modern-section">
          <div className="section-header">
            <span className="section-number">01</span>
            <h2 className="section-title">My Toolkit</h2>
          </div>
          <div className="tmpl-modern-skills">
            {skills.map(skill => (
              <div key={skill.id} className="tmpl-modern-skill-card">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-value">{skill.level}%</span>
                </div>
                <div className="skill-progress">
                  <div className="skill-progress-fill" style={{ width: `${skill.level}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section id="projects" className="tmpl-modern-section">
          <div className="section-header">
            <span className="section-number">02</span>
            <h2 className="section-title">Featured Work</h2>
          </div>
          <div className="tmpl-modern-projects">
            {projects.map(project => (
              <div key={project.id} className="tmpl-modern-project-card">
                <div className="project-image">
                  {project.image ? <img src={project.image} alt={project.title} /> : <div className="project-placeholder"></div>}
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.tech?.map((t, i) => <span key={i} className="project-tag">{t}</span>)}
                  </div>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                      View Project <span>→</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {experience?.length > 0 && (
        <section id="experience" className="tmpl-modern-section">
          <div className="section-header">
            <span className="section-number">03</span>
            <h2 className="section-title">Experience</h2>
          </div>
          <div className="tmpl-modern-timeline">
            {experience.map(exp => (
              <div key={exp.id} className="timeline-item">
                <div className="timeline-date">{exp.duration}</div>
                <div className="timeline-content">
                  <h4>{exp.role}</h4>
                  <p className="company">{exp.company}</p>
                  <p className="desc">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="tmpl-modern-footer">
        <div className="footer-content">
          <div className="footer-left">
            <h3>Let's collaborate</h3>
            <p>Ready to start your next project? Let's talk.</p>
            <a href={`mailto:${profile.email}`} className="footer-email">{profile.email}</a>
          </div>
          <div className="footer-right">
            <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
