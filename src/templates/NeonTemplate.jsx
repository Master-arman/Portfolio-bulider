import './NeonTemplate.css';

export default function NeonTemplate({ data }) {
  const { profile, skills, projects, education, experience, certifications, socialLinks } = data;

  return (
    <div className="tmpl-neon">
      {/* Scan Lines Overlay */}
      <div className="neon-scanlines"></div>

      {/* Hero */}
      <header className="tmpl-neon-hero">
        <div className="neon-glow-border">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="tmpl-neon-avatar" />
          ) : (
            <div className="tmpl-neon-avatar-placeholder">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>
        <h1 className="tmpl-neon-name">{profile.name || 'Your Name'}</h1>
        <p className="tmpl-neon-title">{profile.title || 'Your Title'}</p>
        {profile.location && (
          <p className="tmpl-neon-location">📍 {profile.location}</p>
        )}
        {profile.bio && (
          <p className="tmpl-neon-bio">{profile.bio}</p>
        )}
        <div className="tmpl-neon-socials">
          {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="neon-social-btn">&lt;GitHub/&gt;</a>}
          {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="neon-social-btn">&lt;LinkedIn/&gt;</a>}
          {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="neon-social-btn">&lt;Twitter/&gt;</a>}
          {socialLinks.website && <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="neon-social-btn">&lt;Website/&gt;</a>}
          {socialLinks.dribbble && <a href={socialLinks.dribbble} target="_blank" rel="noopener noreferrer" className="neon-social-btn">&lt;Dribbble/&gt;</a>}
          {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="neon-social-btn">&lt;Instagram/&gt;</a>}
        </div>
      </header>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="tmpl-neon-section">
          <h2 className="tmpl-neon-section-title">
            <span className="neon-bracket">[</span> SKILLS <span className="neon-bracket">]</span>
          </h2>
          <div className="tmpl-neon-skills">
            {skills.map(skill => (
              <div key={skill.id} className="neon-skill-card">
                <div className="neon-skill-header">
                  <span>{skill.name}</span>
                  <span className="neon-pct">{skill.level}%</span>
                </div>
                <div className="neon-skill-bar">
                  <div className="neon-skill-fill" style={{ width: `${skill.level}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="tmpl-neon-section">
          <h2 className="tmpl-neon-section-title">
            <span className="neon-bracket">[</span> EXPERIENCE <span className="neon-bracket">]</span>
          </h2>
          <div className="tmpl-neon-items">
            {experience.map(exp => (
              <div key={exp.id} className="neon-card">
                <div className="neon-card-glow"></div>
                <h4>{exp.role}</h4>
                <p className="neon-sub">{exp.company} {exp.duration && `• ${exp.duration}`}</p>
                {exp.location && <p className="neon-meta">📍 {exp.location}</p>}
                {exp.description && <p className="neon-desc">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="tmpl-neon-section">
          <h2 className="tmpl-neon-section-title">
            <span className="neon-bracket">[</span> PROJECTS <span className="neon-bracket">]</span>
          </h2>
          <div className="tmpl-neon-projects">
            {projects.map(project => (
              <div key={project.id} className="neon-card neon-project">
                <div className="neon-card-glow"></div>
                {project.image && (
                  <div className="neon-project-img">
                    <img src={project.image} alt={project.title} />
                  </div>
                )}
                <div className="neon-project-body">
                  <h3>{project.title}</h3>
                  {project.description && <p>{project.description}</p>}
                  {project.tech?.length > 0 && (
                    <div className="neon-tags">
                      {project.tech.map((t, i) => <span key={i} className="neon-tag">{t}</span>)}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="neon-link">
                      [ OPEN ] →
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
        <section className="tmpl-neon-section">
          <h2 className="tmpl-neon-section-title">
            <span className="neon-bracket">[</span> EDUCATION <span className="neon-bracket">]</span>
          </h2>
          <div className="tmpl-neon-items">
            {education.map(edu => (
              <div key={edu.id} className="neon-card">
                <div className="neon-card-glow"></div>
                <h4>{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                <p className="neon-sub">{edu.institution}</p>
                <div className="neon-meta-row">
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
        <section className="tmpl-neon-section">
          <h2 className="tmpl-neon-section-title">
            <span className="neon-bracket">[</span> CERTIFICATIONS <span className="neon-bracket">]</span>
          </h2>
          <div className="tmpl-neon-grid">
            {certifications.map(cert => (
              <div key={cert.id} className="neon-card neon-cert-card">
                <div className="neon-card-glow"></div>
                <span className="neon-cert-emoji">🏆</span>
                <h4>{cert.name}</h4>
                {cert.issuer && <p className="neon-sub">{cert.issuer}</p>}
                {cert.year && <p className="neon-meta">{cert.year}</p>}
                {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer" className="neon-link">View →</a>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {(profile.email || profile.phone) && (
        <section className="tmpl-neon-section">
          <h2 className="tmpl-neon-section-title">
            <span className="neon-bracket">[</span> CONTACT <span className="neon-bracket">]</span>
          </h2>
          <div className="neon-card neon-contact">
            <div className="neon-card-glow"></div>
            {profile.email && <p>📧 {profile.email}</p>}
            {profile.phone && <p>📱 {profile.phone}</p>}
          </div>
        </section>
      )}

      <footer className="tmpl-neon-footer">
        <p><span className="neon-bracket">&lt;</span> Built with FolioBuilder <span className="neon-bracket">/&gt;</span></p>
      </footer>
    </div>
  );
}
