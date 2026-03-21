import { useParams, Link } from 'react-router-dom';
import { useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import html2pdf from 'html2pdf.js';
import MinimalTemplate from '../templates/MinimalTemplate';
import DeveloperTemplate from '../templates/DeveloperTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import ElegantTemplate from '../templates/ElegantTemplate';
import GlassmorphismTemplate from '../templates/GlassmorphismTemplate';
import NeonTemplate from '../templates/NeonTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import './PreviewPage.css';

const templateMap = {
  minimal: MinimalTemplate,
  developer: DeveloperTemplate,
  creative: CreativeTemplate,
  elegant: ElegantTemplate,
  glassmorphism: GlassmorphismTemplate,
  neon: NeonTemplate,
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
};

export default function PreviewPage() {
  const { id } = useParams();
  const { portfolios, userId } = usePortfolio();
  const templateRef = useRef();

  // Try multiple ways to find the portfolio
  const portfolio = portfolios.find(p => 
    String(p.id) === String(id) || 
    String(p.dbId) === String(id) ||
    String(p.userId) === String(id)
  );

  if (!portfolio) {
    return (
      <div className="preview-not-found">
        <div className="pnf-content">
          <h1>404</h1>
          <p>Portfolio not found</p>
          <Link to="/dashboard" className="btn btn-primary">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const Template = templateMap[portfolio.template] || MinimalTemplate;

  // Use the DB ID for backend operations (PDF download)
  const backendId = portfolio.dbId || portfolio.id;

  const handleDownloadPdf = async () => {
    const element = templateRef.current;
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `${portfolio.profile?.name || 'Portfolio'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="preview-page">
      {/* Floating Buttons */}
      <div className="preview-actions">
        <Link to="/dashboard" className="preview-back-btn glass">
          ← Back
        </Link>
        <button 
          onClick={handleDownloadPdf}
          className="preview-download-btn glass"
        >
          📄 Download PDF
        </button>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          }}
          className="preview-copy-btn glass"
          style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: 'white', padding: '10px 15px', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)' }}
        >
          🔗 Copy Link
        </button>
      </div>
      <div ref={templateRef}>
        <Template data={portfolio} />
      </div>
    </div>
  );
}
