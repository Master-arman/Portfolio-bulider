import './DeveloperTemplate.css';

export default function DeveloperTemplate({ data }) {
  const { profile, skills, projects, education, socialLinks } = data;

  return (
    <div className="tmpl-dev">
      {/* Terminal Header */}
      <div className="tmpl-dev-terminal-bar">
        <div className="terminal-dots">
          <span className="td td-red"></span>
          <span className="td td-yellow"></span>
          <span className="td td-green"></span>
        </div>
        <span className="terminal-title">portfolio.exe — {profile.name || 'developer'}</span>
      </div>

      {/* Hero */}
      <header className="tmpl-dev-hero">
        <div className="tmpl-dev-hero-inner">
          <div className="tmpl-dev-ascii">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="tmpl-dev-avatar" />
            ) : (
              <div className="tmpl-dev-avatar-code">{'>'}_</div>
            )}
          </div>
          <div className="tmpl-dev-intro">
            <p className="tmpl-dev-greeting">
              <span className="code-keyword">const</span>{' '}
              <span className="code-var">developer</span>{' '}
              <span className="code-op">=</span> {'{'}
            </p>
            <p className="tmpl-dev-field">
              &nbsp;&nbsp;<span className="code-key">name</span>: <span className="code-string">"{profile.name || 'Your Name'}"</span>,
            </p>
            <p className="tmpl-dev-field">
              &nbsp;&nbsp;<span className="code-key">title</span>: <span className="code-string">"{profile.title || 'Developer'}"</span>,
            </p>
            {profile.location && (
              <p className="tmpl-dev-field">
                &nbsp;&nbsp;<span className="code-key">location</span>: <span className="code-string">"{profile.location}"</span>,
              </p>
            )}
            <p className="tmpl-dev-greeting">{'}'}</p>
          </div>
          {profile.bio && (
            <p className="tmpl-dev-bio">
              <span className="code-comment">// {profile.bio}</span>
            </p>
          )}

          {/* Social */}
          <div className="tmpl-dev-socials">
            {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="dev-social">⟨github⟩</a>}
            {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="dev-social">⟨linkedin⟩</a>}
            {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="dev-social">⟨twitter⟩</a>}
            {socialLinks.website && <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="dev-social">⟨website⟩</a>}
          </div>
        </div>
      </header>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="tmpl-dev-section">
          <h2 className="tmpl-dev-section-title">
            <span className="code-comment">/**</span> Skills <span className="code-comment">*/</span>
          </h2>
          <div className="tmpl-dev-skills">
            {skills.map(skill => (
              <div key={skill.id} className="tmpl-dev-skill">
                <div className="tmpl-dev-skill-header">
                  <span className="code-string">{skill.name}</span>
                  <span className="tmpl-dev-skill-pct">{skill.level}%</span>
                </div>
                <div className="tmpl-dev-skill-bar">
                  <div className="tmpl-dev-skill-fill" style={{ width: `${skill.level}%` }}>
                    {Array.from({ length: Math.floor(skill.level / 5) }, (_, i) => (
                      <span key={i} className="bar-char">█</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="tmpl-dev-section">
          <h2 className="tmpl-dev-section-title">
            <span className="code-comment">/**</span> Projects <span className="code-comment">*/</span>
          </h2>
          <div className="tmpl-dev-projects">
            {projects.map(project => (
              <div key={project.id} className="tmpl-dev-project">
                <div className="tmpl-dev-project-header">
                  <span className="code-keyword">class</span>{' '}
                  <span className="code-var">{project.title.replace(/\s/g, '')}</span>{' '}
                  {'{'}
                </div>
                {project.description && (
                  <p className="tmpl-dev-project-desc">
                    &nbsp;&nbsp;<span className="code-comment">// {project.description}</span>
                  </p>
                )}
                {project.tech?.length > 0 && (
                  <div className="tmpl-dev-project-tech">
                    &nbsp;&nbsp;<span className="code-key">stack</span>: [{project.tech.map((t, i) => (
                      <span key={i} className="code-string">"{t}"</span>
                    )).reduce((prev, curr, i) => [prev, ', ', curr])}]
                  </div>
                )}
                {project.link && (
                  <p className="tmpl-dev-project-link">
                    &nbsp;&nbsp;<span className="code-key">url</span>:{' '}
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="code-string">
                      "{project.link}"
                    </a>
                  </p>
                )}
                <p className="tmpl-dev-project-footer">{'}'}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="tmpl-dev-section">
          <h2 className="tmpl-dev-section-title">
            <span className="code-comment">/**</span> Education <span className="code-comment">*/</span>
          </h2>
          <div className="tmpl-dev-education">
            {education.map(edu => (
              <div key={edu.id} className="tmpl-dev-edu">
                <div className="tmpl-dev-edu-marker">$</div>
                <div>
                  <h4><span className="code-var">{edu.degree}</span> {edu.field && <span className="code-comment">// {edu.field}</span>}</h4>
                  <p className="tmpl-dev-edu-inst">{edu.institution}</p>
                  <div className="tmpl-dev-edu-meta">
                    {edu.year && <span>{edu.year}</span>}
                    {edu.grade && <span>| {edu.grade}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {(profile.email || profile.phone) && (
        <section className="tmpl-dev-section">
          <h2 className="tmpl-dev-section-title">
            <span className="code-comment">/**</span> Contact <span className="code-comment">*/</span>
          </h2>
          <div className="tmpl-dev-contact">
            {profile.email && <p><span className="code-key">email</span>: <span className="code-string">"{profile.email}"</span></p>}
            {profile.phone && <p><span className="code-key">phone</span>: <span className="code-string">"{profile.phone}"</span></p>}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="tmpl-dev-footer">
        <p className="code-comment">// Built with FolioBuilder &lt;3</p>
      </footer>
    </div>
  );
}
