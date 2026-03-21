import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import './Dashboard.css';

export default function Dashboard() {
  const { portfolios, deletePortfolio, editPortfolio } = usePortfolio();

  return (
    <div className="dashboard bg-gradient-mesh">
      <div className="container">
        <div className="dashboard-header animate-fadeIn">
          <div>
            <h1 className="page-title">
              Your <span className="gradient-text">Portfolios</span>
            </h1>
            <p className="page-subtitle">Manage and preview all your created portfolios</p>
          </div>
          <Link to="/create" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Portfolio
          </Link>
        </div>

        {portfolios.length === 0 ? (
          <div className="empty-state animate-fadeInUp">
            <div className="empty-icon">📂</div>
            <h2>No Portfolios Yet</h2>
            <p>Create your first portfolio and bring your professional story to life.</p>
            <Link to="/create" className="btn btn-primary btn-lg">
              Create Your First Portfolio
            </Link>
          </div>
        ) : (
          <div className="portfolio-grid">
            {portfolios.map((portfolio, idx) => (
              <div
                key={portfolio.id}
                className="portfolio-card card animate-fadeInUp"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="portfolio-card-header">
                  <div className={`portfolio-template-badge template-${portfolio.template}`}>
                    {portfolio.template}
                  </div>
                  <div className="portfolio-card-actions">
                    <Link
                      to="/create"
                      onClick={() => editPortfolio(portfolio.id)}
                      className="btn btn-ghost btn-sm"
                      title="Edit"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => deletePortfolio(portfolio.id)}
                      className="btn btn-ghost btn-sm"
                      title="Delete"
                    >
                      🗑️
                    </button>
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/preview/${portfolio.id}`;
                        navigator.clipboard.writeText(link);
                        alert('Link copied to clipboard!');
                      }}
                      className="btn btn-ghost btn-sm"
                      title="Copy Shareable Link"
                    >
                      🔗
                    </button>
                  </div>
                </div>

                <div className="portfolio-card-body">
                  <div className="portfolio-avatar">
                    {portfolio.profile.name ? portfolio.profile.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <h3 className="portfolio-name">
                    {portfolio.profile.name || 'Untitled Portfolio'}
                  </h3>
                  <p className="portfolio-title-text">
                    {portfolio.profile.title || 'No title set'}
                  </p>
                  <div className="portfolio-meta">
                    <span className="meta-item">
                      🛠 {portfolio.skills.length} Skills
                    </span>
                    <span className="meta-item">
                      📁 {portfolio.projects.length} Projects
                    </span>
                    <span className="meta-item">
                      🎓 {portfolio.education.length} Education
                    </span>
                  </div>
                </div>

                <div className="portfolio-card-footer">
                  <Link
                    to={`/preview/${portfolio.id}`}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    👁 View Portfolio
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
