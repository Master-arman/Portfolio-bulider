import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { portfolios } = usePortfolio();
  const userId = localStorage.getItem('userId');
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    bio: '',
    phone: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('info');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/auth/profile/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name || '',
          email: data.email || '',
          avatar: data.avatar || '',
          bio: data.bio || '',
          phone: data.phone || '',
          location: data.location || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch(`/api/auth/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userName', profile.name);
        setMessage({ text: '✅ Profile updated successfully!', type: 'success' });
      } else {
        setMessage({ text: `❌ ${data.message}`, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: '❌ Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ text: '❌ New passwords do not match', type: 'error' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage({ text: '❌ Password must be at least 6 characters', type: 'error' });
      return;
    }
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch(`/api/auth/change-password/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: '✅ Password changed successfully!', type: 'success' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ text: `❌ ${data.message}`, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: '❌ Failed to change password', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page bg-gradient-mesh">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const totalSkills = portfolios.reduce((acc, p) => acc + (p.skills?.length || 0), 0);
  const totalProjects = portfolios.reduce((acc, p) => acc + (p.projects?.length || 0), 0);

  return (
    <div className="profile-page bg-gradient-mesh">
      <div className="container">
        <div className="profile-header animate-fadeIn">
          <h1 className="page-title">
            My <span className="gradient-text">Profile</span>
          </h1>
          <p className="page-subtitle">Manage your account settings and personal information</p>
        </div>

        <div className="profile-layout animate-fadeInUp">
          {/* Sidebar */}
          <div className="profile-sidebar card">
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <span>{profile.name ? profile.name.charAt(0).toUpperCase() : '?'}</span>
                )}
              </div>
              <h3 className="profile-display-name">{profile.name || 'User'}</h3>
              <p className="profile-display-email">{profile.email}</p>
            </div>

            <div className="profile-stats">
              <div className="profile-stat-item">
                <span className="stat-icon">📋</span>
                <div>
                  <span className="stat-value">{portfolios.length}</span>
                  <span className="stat-label">Portfolios</span>
                </div>
              </div>
              <div className="profile-stat-item">
                <span className="stat-icon">🛠</span>
                <div>
                  <span className="stat-value">{totalSkills}</span>
                  <span className="stat-label">Skills</span>
                </div>
              </div>
              <div className="profile-stat-item">
                <span className="stat-icon">📁</span>
                <div>
                  <span className="stat-value">{totalProjects}</span>
                  <span className="stat-label">Projects</span>
                </div>
              </div>
            </div>

            <nav className="profile-nav">
              <button 
                className={`profile-nav-item ${activeSection === 'info' ? 'active' : ''}`}
                onClick={() => setActiveSection('info')}
              >
                👤 Personal Info
              </button>
              <button 
                className={`profile-nav-item ${activeSection === 'security' ? 'active' : ''}`}
                onClick={() => setActiveSection('security')}
              >
                🔒 Security
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="profile-content card">
            {message.text && (
              <div className={`profile-message ${message.type}`}>
                {message.text}
              </div>
            )}

            {activeSection === 'info' && (
              <div className="profile-info-section">
                <h2 className="section-heading">Personal Information</h2>
                <p className="section-desc">Update your personal details and public profile</p>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Your full name"
                      value={profile.name}
                      onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email (Read-only)</label>
                    <input
                      className="form-input"
                      type="email"
                      value={profile.email}
                      disabled
                      style={{ opacity: 0.6 }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-input"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={profile.phone}
                      onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="City, Country"
                      value={profile.location}
                      onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Avatar URL</label>
                    <input
                      className="form-input"
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={profile.avatar}
                      onChange={e => setProfile(p => ({ ...p, avatar: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label">Bio</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="A short bio about yourself..."
                    value={profile.bio}
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    rows={4}
                  />
                </div>

                <button 
                  className="btn btn-primary" 
                  onClick={handleSaveProfile} 
                  disabled={saving}
                  style={{ marginTop: 24 }}
                >
                  {saving ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="profile-security-section">
                <h2 className="section-heading">Change Password</h2>
                <p className="section-desc">Update your password to keep your account secure</p>

                <div className="password-form">
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Enter current password"
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Enter new password (min 6 chars)"
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Re-enter new password"
                      value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    />
                  </div>

                  <button 
                    className="btn btn-primary" 
                    onClick={handleChangePassword}
                    disabled={saving}
                    style={{ marginTop: 16 }}
                  >
                    {saving ? '⏳ Updating...' : '🔐 Change Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
