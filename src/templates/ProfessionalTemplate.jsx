import './ProfessionalTemplate.css';

export default function ProfessionalTemplate({ data }) {
  const { profile, skills, projects, education, socialLinks, experience, certifications } = data;

  return (
    <div className="tmpl-prof">
      <header className="tmpl-prof-header">
        <div className="tmpl-prof-container">
          <div className="tmpl-prof-header-inner">
            <div className="tmpl-prof-branding">
              <span className="tmpl-prof-initial">{profile.name ? profile.name.charAt(0) : 'P'}</span>
              <span className="tmpl-prof-brand-name">{profile.name || 'Portfolio'}</span>
            </div>
            <nav className="tmpl-prof-nav">
              <a href="#about">About</a>
              <a href="#projects">Work</a>
              <a href="#expertise">Expertise</a>
              <a href="#experience">History</a>
              <a href={`mailto:${profile.email}`} className="tmpl-prof-contact-btn">Get Started</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section id="about" className="tmpl-prof-hero">
          <div className="tmpl-prof-container">
            <div className="tmpl-prof-hero-grid">
              <div className="tmpl-prof-hero-content">
                <h1 className="tmpl-prof-name animate-text">{profile.name}</h1>
                <h2 className="tmpl-prof-title animate-text-delay">{profile.title}</h2>
                <div className="tmpl-prof-divider"></div>
                <p className="tmpl-prof-bio animate-text-delay-2">{profile.bio}</p>
                <div className="tmpl-prof-social">
                  {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                  {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                  {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>}
                </div>
              </div>
              <div className="tmpl-prof-hero-visual">
                <div className="tmpl-prof-image-container">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="tmpl-prof-avatar" />
                  ) : (
                    <div className="tmpl-prof-avatar-placeholder">Professional</div>
                  )}
                  <div className="tmpl-prof-experience-badge">
                    <span className="years">Focused</span>
                    <span className="label">on Excellence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {skills.length > 0 && (
          <section id="expertise" className="tmpl-prof-expertise">
            <div className="tmpl-prof-container">
              <div className="tmpl-prof-section-header">
                <h3>Core Expertise</h3>
                <div className="header-line"></div>
              </div>
              <div className="tmpl-prof-skills-grid">
                {skills.map(skill => (
                  <div key={skill.id} className="tmpl-prof-skill-item">
                    <div className="skill-meta">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-level">{skill.level}%</span>
                    </div>
                    <div className="skill-track">
                      <div className="skill-fill" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section id="projects" className="tmpl-prof-projects">
            <div className="tmpl-prof-container">
              <div className="tmpl-prof-section-header">
                <h3>Featured Projects</h3>
                <div className="header-line"></div>
              </div>
              <div className="tmpl-prof-projects-grid">
                {projects.map(project => (
                  <div key={project.id} className="tmpl-prof-project-row">
                    <div className="project-media">
                      {project.image ? <img src={project.image} alt={project.title} /> : <div className="placeholder">Project</div>}
                    </div>
                    <div className="project-details">
                      <h4>{project.title}</h4>
                      <p>{project.description}</p>
                      <div className="project-footer">
                        <div className="project-tags">
                            {project.tech?.map((t, i) => <span key={i} className="tag">{t}</span>)}
                        </div>
                        {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">Explore Case Study →</a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {experience?.length > 0 && (
          <section id="experience" className="tmpl-prof-experience">
            <div className="tmpl-prof-container">
              <div className="tmpl-prof-section-header">
                <h3>Career Path</h3>
                <div className="header-line"></div>
              </div>
              <div className="tmpl-prof-timeline">
                {experience.map(exp => (
                  <div key={exp.id} className="tmpl-prof-timeline-item">
                    <div className="timeline-aside">
                      <span className="timeline-date">{exp.duration}</span>
                    </div>
                    <div className="timeline-main">
                      <h4>{exp.role}</h4>
                      <h5 className="company">{exp.company}</h5>
                      <p className="description">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {certifications?.length > 0 && (
            <section className="tmpl-prof-certs">
                <div className="tmpl-prof-container">
                    <div className="tmpl-prof-section-header">
                        <h3>Certifications</h3>
                        <div className="header-line"></div>
                    </div>
                    <div className="tmpl-prof-certs-list">
                        {certifications.map(cert => (
                            <div key={cert.id} className="tmpl-prof-cert-card">
                                <h5>{cert.name}</h5>
                                <p>{cert.issuer} • {cert.year}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )}
      </main>

      <footer className="tmpl-prof-footer">
        <div className="tmpl-prof-container">
            <div className="footer-top">
                <div className="footer-branding">
                    <h3>{profile.name}</h3>
                    <p>{profile.title}</p>
                </div>
                <div className="footer-links">
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                    <p>{profile.phone}</p>
                    <p>{profile.location}</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} {profile.name}. Corporate Portfolio Model.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
