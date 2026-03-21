import './ElegantTemplate.css';

export default function ElegantTemplate({ data }) {
  const { profile, skills, projects, education, experience, certifications, socialLinks } = data;

  return (
    <div className="tmpl-elegant">
      {/* Hero Section */}
      <header className="tmpl-elegant-hero">
        <div className="elegant-decorative-line"></div>
        <div className="tmpl-elegant-hero-inner">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="tmpl-elegant-avatar" />
          ) : (
            <div className="tmpl-elegant-avatar-placeholder">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '✦'}
            </div>
          )}
          <h1 className="tmpl-elegant-name">{profile.name || 'Your Name'}</h1>
          <div className="elegant-title-divider">
            <span className="elegant-diamond">◆</span>
          </div>
          <p className="tmpl-elegant-title">{profile.title || 'Your Title'}</p>
          {profile.location && (
            <p className="tmpl-elegant-location">{profile.location}</p>
          )}
          {profile.bio && (
            <p className="tmpl-elegant-bio">{profile.bio}</p>
          )}
          <div className="tmpl-elegant-socials">
            {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="elegant-social">GitHub</a>}
            {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="elegant-social">LinkedIn</a>}
            {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="elegant-social">Twitter</a>}
            {socialLinks.website && <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="elegant-social">Website</a>}
            {socialLinks.dribbble && <a href={socialLinks.dribbble} target="_blank" rel="noopener noreferrer" className="elegant-social">Dribbble</a>}
            {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="elegant-social">Instagram</a>}
          </div>
        </div>
      </header>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="tmpl-elegant-section">
          <h2 className="tmpl-elegant-section-title"><span>Skills</span></h2>
          <div className="tmpl-elegant-skills">
            {skills.map(skill => (
              <div key={skill.id} className="tmpl-elegant-skill">
                <div className="elegant-skill-header">
                  <span>{skill.name}</span>
                  <span className="elegant-skill-pct">{skill.level}%</span>
                </div>
                <div className="elegant-skill-track">
                  <div className="elegant-skill-fill" style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="tmpl-elegant-section">
          <h2 className="tmpl-elegant-section-title"><span>Experience</span></h2>
          <div className="tmpl-elegant-timeline">
            {experience.map(exp => (
              <div key={exp.id} className="elegant-timeline-item">
                <div className="elegant-timeline-marker">◆</div>
                <div className="elegant-timeline-content">
                  <h4>{exp.role} <span className="elegant-muted">at {exp.company}</span></h4>
                  {exp.duration && <p className="elegant-duration">{exp.duration}</p>}
                  {exp.location && <p className="elegant-location-sub">📍 {exp.location}</p>}
                  {exp.description && <p className="elegant-desc">{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="tmpl-elegant-section">
          <h2 className="tmpl-elegant-section-title"><span>Projects</span></h2>
          <div className="tmpl-elegant-projects">
            {projects.map(project => (
              <div key={project.id} className="tmpl-elegant-project">
                {project.image && (
                  <div className="elegant-project-image">
                    <img src={project.image} alt={project.title} />
                  </div>
                )}
                <div className="elegant-project-content">
                  <h3>{project.title}</h3>
                  {project.description && <p>{project.description}</p>}
                  {project.tech?.length > 0 && (
                    <div className="elegant-tags">
                      {project.tech.map((t, i) => <span key={i} className="elegant-tag">{t}</span>)}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="elegant-project-link">
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
        <section className="tmpl-elegant-section">
          <h2 className="tmpl-elegant-section-title"><span>Education</span></h2>
          <div className="tmpl-elegant-education">
            {education.map(edu => (
              <div key={edu.id} className="elegant-edu-item">
                <div className="elegant-edu-icon">🎓</div>
                <div>
                  <h4>{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                  <p className="elegant-edu-inst">{edu.institution}</p>
                  <div className="elegant-edu-meta">
                    {edu.year && <span>📅 {edu.year}</span>}
                    {edu.grade && <span>⭐ {edu.grade}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="tmpl-elegant-section">
          <h2 className="tmpl-elegant-section-title"><span>Certifications</span></h2>
          <div className="tmpl-elegant-certs">
            {certifications.map(cert => (
              <div key={cert.id} className="elegant-cert-card">
                <span className="elegant-cert-icon">🏆</span>
                <h4>{cert.name}</h4>
                {cert.issuer && <p className="elegant-cert-issuer">{cert.issuer}</p>}
                {cert.year && <p className="elegant-cert-year">{cert.year}</p>}
                {cert.link && (
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="elegant-cert-link">View →</a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {(profile.email || profile.phone) && (
        <section className="tmpl-elegant-section tmpl-elegant-contact">
          <h2 className="tmpl-elegant-section-title"><span>Contact</span></h2>
          <div className="tmpl-elegant-contact-info">
            {profile.email && <p>📧 {profile.email}</p>}
            {profile.phone && <p>📱 {profile.phone}</p>}
          </div>
        </section>
      )}

      <footer className="tmpl-elegant-footer">
        <div className="elegant-footer-diamond">◆</div>
        <p>Built with FolioBuilder</p>
      </footer>
    </div>
  );
}
