import './CreativeTemplate.css';

export default function CreativeTemplate({ data }) {
  const { profile, skills, projects, education, socialLinks } = data;

  return (
    <div className="tmpl-creative">
      {/* Hero */}
      <header className="tmpl-creative-hero">
        <div className="creative-bg-shape creative-shape-1"></div>
        <div className="creative-bg-shape creative-shape-2"></div>
        <div className="creative-bg-shape creative-shape-3"></div>

        <div className="tmpl-creative-hero-inner">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="tmpl-creative-avatar" />
          ) : (
            <div className="tmpl-creative-avatar-placeholder">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '✦'}
            </div>
          )}

          <h1 className="tmpl-creative-name">{profile.name || 'Your Name'}</h1>
          <p className="tmpl-creative-title">{profile.title || 'Your Title'}</p>

          {profile.location && (
            <p className="tmpl-creative-location">📍 {profile.location}</p>
          )}

          {profile.bio && (
            <p className="tmpl-creative-bio">{profile.bio}</p>
          )}

          <div className="tmpl-creative-socials">
            {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="creative-social-btn">GitHub</a>}
            {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="creative-social-btn">LinkedIn</a>}
            {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="creative-social-btn">Twitter</a>}
            {socialLinks.website && <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="creative-social-btn">Website</a>}
            {socialLinks.dribbble && <a href={socialLinks.dribbble} target="_blank" rel="noopener noreferrer" className="creative-social-btn">Dribbble</a>}
            {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="creative-social-btn">Instagram</a>}
          </div>
        </div>
      </header>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="tmpl-creative-section">
          <h2 className="tmpl-creative-section-title">
            <span className="creative-title-accent">✦</span> Skills
          </h2>
          <div className="tmpl-creative-skills">
            {skills.map(skill => (
              <div key={skill.id} className="tmpl-creative-skill-chip">
                <span className="creative-skill-name">{skill.name}</span>
                <div className="creative-skill-dots">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`creative-dot ${i < Math.ceil(skill.level / 20) ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="tmpl-creative-section">
          <h2 className="tmpl-creative-section-title">
            <span className="creative-title-accent">✦</span> Projects
          </h2>
          <div className="tmpl-creative-projects">
            {projects.map((project, idx) => (
              <div key={project.id} className={`tmpl-creative-project ${idx % 2 === 0 ? 'even' : 'odd'}`}>
                {project.image && (
                  <div className="creative-project-img">
                    <img src={project.image} alt={project.title} />
                  </div>
                )}
                <div className="creative-project-content">
                  <span className="creative-project-num">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3>{project.title}</h3>
                  {project.description && <p>{project.description}</p>}
                  {project.tech?.length > 0 && (
                    <div className="creative-project-tags">
                      {project.tech.map((t, i) => (
                        <span key={i} className="creative-tag">{t}</span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="creative-project-link">
                      Explore →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="tmpl-creative-section">
          <h2 className="tmpl-creative-section-title">
            <span className="creative-title-accent">✦</span> Education
          </h2>
          <div className="tmpl-creative-timeline">
            {education.map(edu => (
              <div key={edu.id} className="tmpl-creative-timeline-item">
                <div className="creative-timeline-dot"></div>
                <div className="creative-timeline-content">
                  <h4>{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                  <p className="creative-timeline-place">{edu.institution}</p>
                  <div className="creative-timeline-meta">
                    {edu.year && <span>📅 {edu.year}</span>}
                    {edu.grade && <span>⭐ {edu.grade}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {(profile.email || profile.phone) && (
        <section className="tmpl-creative-section tmpl-creative-contact-section">
          <h2 className="tmpl-creative-section-title">
            <span className="creative-title-accent">✦</span> Let's Connect
          </h2>
          <div className="tmpl-creative-contact-cards">
            {profile.email && (
              <div className="creative-contact-card">
                <span className="contact-icon">📧</span>
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="creative-contact-card">
                <span className="contact-icon">📱</span>
                <span>{profile.phone}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="tmpl-creative-footer">
        <p>Crafted with 💖 using FolioBuilder</p>
      </footer>
    </div>
  );
}
