import MinimalTemplate from '../templates/MinimalTemplate';
import DeveloperTemplate from '../templates/DeveloperTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import ElegantTemplate from '../templates/ElegantTemplate';
import GlassmorphismTemplate from '../templates/GlassmorphismTemplate';
import NeonTemplate from '../templates/NeonTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';

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

export default function LivePreview({ data, mini = false }) {
  const Template = templateMap[data.template] || MinimalTemplate;

  return (
    <div className={`live-preview ${mini ? 'mini' : 'full'}`} style={mini ? { transform: 'scale(0.6)', transformOrigin: 'top left', width: '166.67%' } : {}}>
      <Template data={data} />
    </div>
  );
}
