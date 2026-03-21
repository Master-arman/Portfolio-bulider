import { Link, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { setTemplate } = usePortfolio();

  const handleTemplateSelect = (id) => {
    setTemplate(id);
    navigate('/create');
  };

  return (
    <div className="home bg-gradient-mesh">
      {/* Floating Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-badge animate-fadeIn">
            <span className="badge">✨ Portfolio Builder v1.0</span>
          </div>

          <h1 className="hero-title animate-fadeInUp">
            Build Your
            <span className="gradient-text"> Dream Portfolio </span>
            in Minutes
          </h1>

          <p className="hero-subtitle animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Create stunning, professional portfolios with our intuitive builder.
            Choose from beautiful templates, add your details, and share your
            portfolio with the world — no coding required.
          </p>

          <div className="hero-actions animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <Link to="/create" className="btn btn-primary btn-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Portfolio
            </Link>
            <Link to="/dashboard" className="btn btn-outline btn-lg">
              View Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="stat">
              <span className="stat-number">8+</span>
              <span className="stat-label">Templates</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">5+</span>
              <span className="stat-label">Sections</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Possibilities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">
            Everything You Need to <span className="gradient-text">Stand Out</span>
          </h2>
          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="templates-section">
        <div className="container">
          <h2 className="section-title">
            Choose Your <span className="gradient-text">Style</span>
          </h2>
          <p className="section-subtitle">
            Pick from our handcrafted templates designed to impress
          </p>
          <div className="template-cards">
            {templates.map((tmpl, i) => (
              <div 
                key={i} 
                className="template-card card clickable" 
                onClick={() => handleTemplateSelect(tmpl.id)}
              >
                <div className="template-preview" style={{ background: tmpl.bg }}>
                  <div className="template-preview-content">
                    <div className="tpc-avatar" style={{ background: tmpl.accent }}></div>
                    <div className="tpc-line tpc-line-1" style={{ background: tmpl.accent }}></div>
                    <div className="tpc-line tpc-line-2"></div>
                    <div className="tpc-line tpc-line-3"></div>
                    <div className="tpc-dots">
                      <div className="tpc-dot" style={{ background: tmpl.accent }}></div>
                      <div className="tpc-dot" style={{ background: tmpl.accent }}></div>
                      <div className="tpc-dot" style={{ background: tmpl.accent }}></div>
                    </div>
                  </div>
                </div>
                <div className="template-info">
                  <h3>{tmpl.name}</h3>
                  <p>{tmpl.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="templates-cta">
            <Link to="/create" className="btn btn-accent btn-lg">
              Start Building Now →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box glass">
            <h2>Ready to Build Your Portfolio?</h2>
            <p>It only takes a few minutes to create something amazing.</p>
            <Link to="/create" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: '🎨',
    title: 'Beautiful Templates',
    desc: 'Choose from professionally designed templates that make your work shine.',
  },
  {
    icon: '⚡',
    title: 'Live Preview',
    desc: 'See real-time changes as you build. What you see is what you get.',
  },
  {
    icon: '📱',
    title: 'Fully Responsive',
    desc: 'Your portfolio looks stunning on every device — desktop, tablet, or phone.',
  },
  {
    icon: '🛠️',
    title: 'Easy to Customize',
    desc: 'Add your projects, skills, education, and social links with a simple form.',
  },
  {
    icon: '🚀',
    title: 'Instant Publish',
    desc: 'Generate and share your portfolio link instantly with anyone.',
  },
  {
    icon: '💼',
    title: 'Multiple Portfolios',
    desc: 'Create and manage multiple portfolios for different purposes.',
  },
];

const templates = [
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Clean and elegant, perfect for any profession',
    bg: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    accent: '#6C63FF',
  },
  {
    id: 'developer',
    name: 'Developer',
    desc: 'Terminal-inspired, ideal for tech professionals',
    bg: 'linear-gradient(135deg, #0d1117, #161b22)',
    accent: '#06D6A0',
  },
  {
    id: 'creative',
    name: 'Creative',
    desc: 'Bold and vibrant, designed for creatives',
    bg: 'linear-gradient(135deg, #2d1b69, #11998e)',
    accent: '#FF6B9D',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    desc: 'Sophisticated gold accents on dark themes',
    bg: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
    accent: '#D4AF37',
  },
  {
    id: 'glassmorphism',
    name: 'Glass',
    desc: 'Modern frosted glass with soft gradients',
    bg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    accent: '#00D2FF',
  },
  {
    id: 'neon',
    name: 'Neon',
    desc: 'Cyberpunk glow for bold personalities',
    bg: 'linear-gradient(135deg, #0a0a0a, #1a0a2e)',
    accent: '#FF00FF',
  },
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Sleek design with dynamic blobs & glass',
    bg: 'linear-gradient(135deg, #0b0b0d, #1a1a2e)',
    accent: '#8C52FF',
  },
  {
    id: 'professional',
    name: 'Professional',
    desc: 'Structured corporate style for excellence',
    bg: 'linear-gradient(135deg, #0A192F, #112240)',
    accent: '#64FFDA',
  },
];
