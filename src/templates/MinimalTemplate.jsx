import './MinimalTemplate.css';

export default function MinimalTemplate({ data }) {
  const { profile, skills, projects, education, experience, certifications, socialLinks } = data;

  return (
    <div className="tmpl-minimal">
      {/* Header / Hero */}
      <header className="tmpl-minimal-hero">
        <div className="tmpl-minimal-hero-inner">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="tmpl-minimal-avatar" />
          ) : (
            <div className="tmpl-minimal-avatar-placeholder">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          <h1 className="tmpl-minimal-name">{profile.name || 'Your Name'}</h1>
          <p className="tmpl-minimal-title">{profile.title || 'Your Title'}</p>
          {profile.location && (
            <p className="tmpl-minimal-location">📍 {profile.location}</p>
          )}
          {profile.bio && (
            <p className="tmpl-minimal-bio">{profile.bio}</p>
          )}
          {/* Social Icons */}
          <div className="tmpl-minimal-socials">
            {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>}
            {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>}
            {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>}
            {socialLinks.website && <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="social-link">Website</a>}
            {socialLinks.dribbble && <a href={socialLinks.dribbble} target="_blank" rel="noopener noreferrer" className="social-link">Dribbble</a>}
            {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>}
          </div>
        </div>
      </header>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="tmpl-minimal-section">
          <h2 className="tmpl-minimal-section-title">Skills</h2>
          <div className="tmpl-minimal-skills">
            {skills.map(skill => (
              <div key={skill.id} className="tmpl-minimal-skill">
                <div className="tmpl-minimal-skill-header">
                  <span>{skill.name}</span>
                  <span className="skill-pct">{skill.level}%</span>
                </div>
                <div className="tmpl-minimal-skill-bar">
                  <div className="tmpl-minimal-skill-fill" style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="tmpl-minimal-section">
          <h2 className="tmpl-minimal-section-title">Projects</h2>
          <div className="tmpl-minimal-projects">
            {projects.map(project => (
              <div key={project.id} className="tmpl-minimal-project">
                {project.image && (
                  <div className="tmpl-minimal-project-img">
                    <img src={project.image} alt={project.title} />
                  </div>
                )}
                <div className="tmpl-minimal-project-info">
                  <h3>{project.title}</h3>
                  {project.description && <p>{project.description}</p>}
                  {project.tech?.length > 0 && (
                    <div className="tmpl-minimal-tags">
                      {project.tech.map((t, i) => <span key={i} className="tmpl-minimal-tag">{t}</span>)}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="tmpl-minimal-link">
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="tmpl-minimal-section">
          <h2 className="tmpl-minimal-section-title">Experience</h2>
          <div className="tmpl-minimal-education">
            {experience.map(exp => (
              <div key={exp.id} className="tmpl-minimal-edu-item">
                <div className="tmpl-minimal-edu-dot"></div>
                <div>
                  <h4>{exp.role}{exp.company && <span style={{fontWeight:400}}> at {exp.company}</span>}</h4>
                  {exp.duration && <p className="edu-institution">📅 {exp.duration}</p>}
                  {exp.description && <p style={{fontSize:'0.85em',marginTop:4}}>{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="tmpl-minimal-section">
          <h2 className="tmpl-minimal-section-title">Education</h2>
          <div className="tmpl-minimal-education">
            {education.map(edu => (
              <div key={edu.id} className="tmpl-minimal-edu-item">
                <div className="tmpl-minimal-edu-dot"></div>
                <div>
                  <h4>{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                  <p className="edu-institution">{edu.institution}</p>
                  <div className="edu-meta">
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
      {certifications?.length > 0 && (
        <section className="tmpl-minimal-section">
          <h2 className="tmpl-minimal-section-title">Certifications</h2>
          <div className="tmpl-minimal-education">
            {certifications.map(cert => (
              <div key={cert.id} className="tmpl-minimal-edu-item">
                <div className="tmpl-minimal-edu-dot"></div>
                <div>
                  <h4>🏆 {cert.name}</h4>
                  {cert.issuer && <p className="edu-institution">{cert.issuer}</p>}
                  {cert.year && <p style={{fontSize:'0.8em',color:'var(--text-muted,#aaa)'}}>📅 {cert.year}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {(profile.email || profile.phone) && (
        <section className="tmpl-minimal-section tmpl-minimal-contact">
          <h2 className="tmpl-minimal-section-title">Contact</h2>
          <div className="tmpl-minimal-contact-info">
            {profile.email && <p>📧 {profile.email}</p>}
            {profile.phone && <p>📱 {profile.phone}</p>}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="tmpl-minimal-footer">
        <p>Built with ❤️ using FolioBuilder</p>
      </footer>
    </div>
  );
}
