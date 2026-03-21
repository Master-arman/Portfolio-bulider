import './GlassmorphismTemplate.css';

export default function GlassmorphismTemplate({ data }) {
  const { profile, skills, projects, education, experience, certifications, socialLinks } = data;

  return (
    <div className="tmpl-glass">
      {/* Floating Orbs Background */}
      <div className="glass-orb glass-orb-1"></div>
      <div className="glass-orb glass-orb-2"></div>
      <div className="glass-orb glass-orb-3"></div>

      {/* Hero */}
      <header className="tmpl-glass-hero">
        <div className="glass-card glass-hero-card">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="tmpl-glass-avatar" />
          ) : (
            <div className="tmpl-glass-avatar-placeholder">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          <h1 className="tmpl-glass-name">{profile.name || 'Your Name'}</h1>
          <p className="tmpl-glass-title">{profile.title || 'Your Title'}</p>
          {profile.location && (
            <p className="tmpl-glass-location">📍 {profile.location}</p>
          )}
          {profile.bio && (
            <p className="tmpl-glass-bio">{profile.bio}</p>
          )}
          <div className="tmpl-glass-socials">
            {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="glass-social-pill">GitHub</a>}
            {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="glass-social-pill">LinkedIn</a>}
            {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="glass-social-pill">Twitter</a>}
            {socialLinks.website && <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="glass-social-pill">Website</a>}
            {socialLinks.dribbble && <a href={socialLinks.dribbble} target="_blank" rel="noopener noreferrer" className="glass-social-pill">Dribbble</a>}
            {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="glass-social-pill">Instagram</a>}
          </div>
        </div>
      </header>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="tmpl-glass-section">
          <h2 className="tmpl-glass-section-title">Skills</h2>
          <div className="tmpl-glass-skills">
            {skills.map(skill => (
              <div key={skill.id} className="glass-card glass-skill-chip">
                <span className="glass-skill-name">{skill.name}</span>
                <div className="glass-skill-bar">
                  <div className="glass-skill-fill" style={{ width: `${skill.level}%` }}>
                    <span className="glass-skill-pct">{skill.level}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="tmpl-glass-section">
          <h2 className="tmpl-glass-section-title">Experience</h2>
          <div className="tmpl-glass-items">
            {experience.map(exp => (
              <div key={exp.id} className="glass-card glass-item">
                <h4>{exp.role}</h4>
                <p className="glass-sub">{exp.company} {exp.duration && `• ${exp.duration}`}</p>
                {exp.location && <p className="glass-meta">📍 {exp.location}</p>}
                {exp.description && <p className="glass-desc">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="tmpl-glass-section">
          <h2 className="tmpl-glass-section-title">Projects</h2>
          <div className="tmpl-glass-projects">
            {projects.map(project => (
              <div key={project.id} className="glass-card glass-project">
                {project.image && (
                  <div className="glass-project-img">
                    <img src={project.image} alt={project.title} />
                  </div>
                )}
                <div className="glass-project-body">
                  <h3>{project.title}</h3>
                  {project.description && <p>{project.description}</p>}
                  {project.tech?.length > 0 && (
                    <div className="glass-tags">
                      {project.tech.map((t, i) => <span key={i} className="glass-tag">{t}</span>)}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="glass-link">
                      View Project →
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
        <section className="tmpl-glass-section">
          <h2 className="tmpl-glass-section-title">Education</h2>
          <div className="tmpl-glass-items">
            {education.map(edu => (
              <div key={edu.id} className="glass-card glass-item">
                <h4>{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                <p className="glass-sub">{edu.institution}</p>
                <div className="glass-meta-row">
                  {edu.year && <span>📅 {edu.year}</span>}
                  {edu.grade && <span>⭐ {edu.grade}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="tmpl-glass-section">
          <h2 className="tmpl-glass-section-title">Certifications</h2>
          <div className="tmpl-glass-grid">
            {certifications.map(cert => (
              <div key={cert.id} className="glass-card glass-cert">
                <span className="glass-cert-icon">🏆</span>
                <h4>{cert.name}</h4>
                {cert.issuer && <p className="glass-sub">{cert.issuer}</p>}
                {cert.year && <p className="glass-meta">{cert.year}</p>}
                {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer" className="glass-link">View →</a>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {(profile.email || profile.phone) && (
        <section className="tmpl-glass-section">
          <h2 className="tmpl-glass-section-title">Contact</h2>
          <div className="glass-card glass-contact">
            {profile.email && <p>📧 {profile.email}</p>}
            {profile.phone && <p>📱 {profile.phone}</p>}
          </div>
        </section>
      )}

      <footer className="tmpl-glass-footer">
        <p>Built with ❤️ using FolioBuilder</p>
      </footer>
    </div>
  );
}
