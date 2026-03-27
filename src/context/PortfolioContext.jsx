import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const PortfolioContext = createContext();
const API_URL = '/api';

const defaultPortfolio = {
  profile: {
    name: '',
    title: '',
    bio: '',
    avatar: '',
    location: '',
    email: '',
    phone: '',
  },
  skills: [],
  projects: [],
  education: [],
  experience: [],
  certifications: [],
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    dribbble: '',
    instagram: '',
  },
  template: 'minimal',
};

// Helper to Load from LocalStorage
const loadFromLocal = () => {
  const data = localStorage.getItem('portfolios');
  return data ? JSON.parse(data) : [];
};

export function PortfolioProvider({ children }) {
  const [portfolios, setPortfolios] = useState(loadFromLocal());
  const [currentPortfolio, setCurrentPortfolio] = useState({ ...defaultPortfolio });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  // Fetch from backend on load
  useEffect(() => {
    const fetchFromBackend = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/portfolio`);
        if (res.ok) {
          const dbData = await res.json();
          // Transform DB format back to Context format
          const formatted = {
            id: dbData.id,
            profile: {
              name: dbData.fullName || '',
              title: dbData.professionalTitle || '',
              bio: dbData.bio || '',
              avatar: dbData.profilePicUrl || '',
              location: dbData.location || '',
              email: dbData.email || '',
              phone: dbData.phone || ''
            },
            socialLinks: {
              github: dbData.github || '',
              linkedin: dbData.linkedin || '',
              twitter: dbData.twitter || '',
              website: dbData.website || '',
              dribbble: '',
              instagram: ''
            },
            // Map DB column names back to frontend field names
            skills: (dbData.skills || []).map(s => ({
              id: s.id || Date.now(),
              name: s.name,
              level: s.level || 80,
            })),
            projects: (dbData.projects || []).map(p => ({
              id: p.id || Date.now(),
              title: p.title,
              description: p.description,
              image: p.image_url || p.image || '',
              link: p.github_link || p.link || '',
              live_link: p.live_link || '',
              tech: p.tech || [],
            })),
            education: (dbData.education || []).map(e => ({
              id: e.id || Date.now(),
              institution: e.school || e.institution || '',
              degree: e.degree || '',
              field: e.field || '',
              year: e.startYear || e.year || '',
              grade: e.grade || '',
            })),
            experience: (dbData.experience || []).map(e => ({
              id: e.id || Date.now(),
              role: e.role || '',
              company: e.company || '',
              duration: e.duration || '',
              description: e.description || '',
              location: e.location || '',
            })),
            certifications: (dbData.certifications || []).map(c => ({
              id: c.id || Date.now(),
              name: c.name || '',
              issuer: c.issuer || '',
              year: c.year || '',
            })),
            template: dbData.template || 'minimal'
          };
          setPortfolios([formatted]);
          setCurrentPortfolio(formatted);
          setEditingId(formatted.id);
        }
      } catch (err) {
        console.error('❌ Failed to load portfolio from backend:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFromBackend();
  }, []);


  // Sync to LocalStorage whenever portfolios change
  useEffect(() => {
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
  }, [portfolios]);

  const updateProfile = useCallback((field, value) => {
    setCurrentPortfolio(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  }, []);

  const updateSocialLinks = useCallback((field, value) => {
    setCurrentPortfolio(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value },
    }));
  }, []);

  const setTemplate = useCallback((template) => {
    setCurrentPortfolio(prev => ({ ...prev, template }));
  }, []);

  // ===== Skills =====
  const addSkill = useCallback((skill) => {
    if (skill.trim()) {
      setCurrentPortfolio(prev => ({
        ...prev,
        skills: [...prev.skills, { id: Date.now(), name: skill.trim(), level: 80 }],
      }));
    }
  }, []);

  const removeSkill = useCallback((id) => {
    setCurrentPortfolio(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));
  }, []);

  const updateSkillLevel = useCallback((id, level) => {
    setCurrentPortfolio(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, level } : s),
    }));
  }, []);

  // ===== Projects =====
  const addProject = useCallback((project) => {
    setCurrentPortfolio(prev => ({
      ...prev,
      projects: [...prev.projects, { id: Date.now(), ...project }],
    }));
  }, []);

  const removeProject = useCallback((id) => {
    setCurrentPortfolio(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  }, []);

  const updateProject = useCallback((id, project) => {
    setCurrentPortfolio(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...project } : p),
    }));
  }, []);

  // ===== Education =====
  const addEducation = useCallback((edu) => {
    setCurrentPortfolio(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now(), ...edu }],
    }));
  }, []);

  const removeEducation = useCallback((id) => {
    setCurrentPortfolio(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id),
    }));
  }, []);

  // ===== Experience =====
  const addExperience = useCallback((exp) => {
    setCurrentPortfolio(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now(), ...exp }],
    }));
  }, []);

  const removeExperience = useCallback((id) => {
    setCurrentPortfolio(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id),
    }));
  }, []);

  // ===== Certifications =====
  const addCertification = useCallback((cert) => {
    setCurrentPortfolio(prev => ({
      ...prev,
      certifications: [...prev.certifications, { id: Date.now(), ...cert }],
    }));
  }, []);

  const removeCertification = useCallback((id) => {
    setCurrentPortfolio(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id),
    }));
  }, []);

  // Backend Save Logic

  const saveToBackend = async (data) => {
    try {
      const response = await fetch(`${API_URL}/portfolio/save-portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.profile.name,
          professionalTitle: data.profile.title,
          location: data.profile.location,
          email: data.profile.email,
          phone: data.profile.phone,
          bio: data.profile.bio,
          profilePicUrl: data.profile.avatar,
          github: data.socialLinks.github,
          linkedin: data.socialLinks.linkedin,
          twitter: data.socialLinks.twitter,
          website: data.socialLinks.website,
          skills: data.skills,
          projects: data.projects,
          education: data.education,
          experience: data.experience || [],
          certifications: data.certifications || [],
          template: data.template || 'minimal'
        }),
      });

      // Handle non-OK responses safely
      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (jsonErr) {
          // If response is HTML, this will fail - we just use the default status message
          console.warn('⚠️ Server returned non-JSON error response');
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Saved successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to save to backend:', error);
      throw error;
    }
  };


  const savePortfolio = useCallback(async () => {
    const portfolioToSave = { 
      ...currentPortfolio, 
      updatedAt: new Date().toISOString() 
    };

    // Save to Database
    const result = await saveToBackend(portfolioToSave);
    
    const dbId = result.portfolio?.id;
    if (dbId) {
      portfolioToSave.id = dbId;
    }

    setPortfolios([portfolioToSave]); // Keep only this one portfolio
    setCurrentPortfolio({ ...defaultPortfolio });
    setEditingId(null);
  }, [currentPortfolio]);

  const deletePortfolio = useCallback(async () => {
    try {
      // Delete from MySQL
      const res = await fetch(`${API_URL}/portfolio`, { method: 'DELETE' });
      
      if (res.ok) {
        setPortfolios([]);
        setCurrentPortfolio({ ...defaultPortfolio });
        localStorage.removeItem('portfolios');
        console.log('✅ Portfolio deleted completely');
      } else {
        alert('Failed to delete portfolio.');
      }
    } catch (err) {
      console.error('❌ Failed to delete:', err);
    }
  }, []);

  const editPortfolio = useCallback((id) => {
    const portfolio = portfolios.find(p => p.id === id);
    if (portfolio) {
      setCurrentPortfolio({ ...portfolio });
      // Use dbId (MySQL ID) as editingId for consistency with backend
      setEditingId(portfolio.dbId || portfolio.id || id);
      console.log('✏️ Editing portfolio with dbId:', portfolio.dbId, 'id:', id);
    }
  }, [portfolios]);

  const resetForm = useCallback(() => {
    setCurrentPortfolio({ ...defaultPortfolio });
    setEditingId(null);
  }, []);

  const value = {
    portfolios,
    currentPortfolio,
    editingId,
    loading,
    updateProfile,
    updateSocialLinks,
    setTemplate,
    addSkill,
    removeSkill,
    updateSkillLevel,
    addProject,
    removeProject,
    updateProject,
    addEducation,
    removeEducation,
    addExperience,
    removeExperience,
    addCertification,
    removeCertification,
    savePortfolio,
    deletePortfolio,
    editPortfolio,
    resetForm,
    setCurrentPortfolio,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
}
