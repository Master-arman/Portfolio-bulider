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
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [loading, setLoading] = useState(false);

  // Fetch from backend once userId is ready
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) setUserId(storedUserId);

    const fetchFromBackend = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/portfolio/${userId}`);
        if (res.ok) {
          const dbData = await res.json();
          // Transform DB format back to Context format
          const formatted = {
            id: dbData.id,           // This is the MySQL auto-increment ID
            dbId: dbData.id,         // Keep a separate reference to the DB ID
            userId: dbData.userId,
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
            skills: dbData.skills || [],
            projects: dbData.projects || [],
            education: dbData.education || [],
            experience: dbData.experience || [],
            certifications: dbData.certifications || [],
            template: dbData.template || 'minimal'
          };
          setPortfolios([formatted]);
          setCurrentPortfolio(formatted);
          setEditingId(formatted.id);
        }
      } catch (err) {
        console.error('Failed to load portfolio from backend', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFromBackend();
  }, [userId]);

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
          userId: data.userId || userId || 1,
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
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save');
      }
      console.log('✅ Saved to MySQL:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to save to MySQL:', error);
      throw error;
    }
  };

  const savePortfolio = useCallback(async () => {
    const portfolioToSave = { 
      ...currentPortfolio, 
      userId,
      updatedAt: new Date().toISOString() 
    };

    // Save to Database FIRST to get the correct MySQL ID
    const result = await saveToBackend(portfolioToSave);
    
    // Use the MySQL-returned ID as single source of truth
    const dbId = result.portfolio?.id;
    if (dbId) {
      portfolioToSave.id = dbId;
      portfolioToSave.dbId = dbId;
    } else {
      // Fallback: use editingId or generate
      portfolioToSave.id = editingId || Date.now();
      portfolioToSave.dbId = editingId || portfolioToSave.id;
    }

    setPortfolios(prev => {
      // Check if portfolio with same userId OR same dbId already exists
      // Use String() comparison to avoid type mismatch (string vs number)
      const existingIdx = prev.findIndex(p => 
        String(p.userId) === String(userId) || 
        String(p.dbId) === String(dbId) || 
        String(p.id) === String(dbId) ||
        (editingId != null && String(p.id) === String(editingId))
      );
      
      if (existingIdx >= 0) {
        // UPDATE existing portfolio
        const updated = [...prev];
        updated[existingIdx] = portfolioToSave;
        console.log('✅ Updated existing portfolio at index:', existingIdx);
        return updated;
      }
      // Only create new if truly no match found
      console.log('✅ Created new portfolio entry');
      return [...prev, portfolioToSave];
    });

    setCurrentPortfolio({ ...defaultPortfolio });
    setEditingId(null);
  }, [currentPortfolio, editingId, userId]);

  const deletePortfolio = useCallback(async (id) => {
    try {
      const portfolioToDelete = portfolios.find(p => p.id === id);
      
      if (!portfolioToDelete) {
        console.error('❌ Portfolio not found in local state with id:', id);
        return;
      }

      // Try multiple IDs to ensure backend delete works
      // Priority: dbId > id > userId
      const backendId = portfolioToDelete.dbId || portfolioToDelete.id || id;
      const fallbackUserId = portfolioToDelete.userId || userId;
      
      console.log('🗑️ Attempting delete - backendId:', backendId, 'userId:', fallbackUserId);

      // Delete from MySQL FIRST, then update UI
      let deleteSuccess = false;
      
      // Try deleting by portfolio ID first
      let res = await fetch(`${API_URL}/portfolio/${backendId}`, { method: 'DELETE' });
      
      if (res.ok) {
        deleteSuccess = true;
        console.log('✅ Deleted from MySQL by portfolio ID:', backendId);
      } else {
        console.warn('⚠️ Delete by portfolio ID failed, trying by userId:', fallbackUserId);
        // Fallback: try deleting by userId
        res = await fetch(`${API_URL}/portfolio/${fallbackUserId}`, { method: 'DELETE' });
        if (res.ok) {
          deleteSuccess = true;
          console.log('✅ Deleted from MySQL by userId:', fallbackUserId);
        } else {
          const errorData = await res.json();
          console.error('❌ Backend delete failed:', errorData);
        }
      }

      if (deleteSuccess) {
        // Only remove from UI after successful backend deletion
        setPortfolios(prev => prev.filter(p => p.id !== id));
        // Also clear localStorage
        localStorage.removeItem('portfolios');
        console.log('✅ Removed from UI and localStorage');
      } else {
        alert('Failed to delete portfolio from server. Please try again.');
      }
    } catch (err) {
      console.error('❌ Failed to delete from backend', err);
      alert('Error deleting portfolio. Please check your connection and try again.');
    }
  }, [portfolios, userId]);

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
    userId,
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
