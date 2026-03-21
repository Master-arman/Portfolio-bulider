import { NavLink, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const isPreviewPage = location.pathname.startsWith('/preview/');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const isLoggedIn = !!localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || '';
  const userEmail = localStorage.getItem('userEmail') || '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isPreviewPage) return null;

  const getInitial = () => {
    if (userName) return userName.charAt(0).toUpperCase();
    if (userEmail) return userEmail.charAt(0).toUpperCase();
    return '?';
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-inner container">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#brand-grad)" />
              <path d="M8 10h4v8H8zM14 8h4v12h-4zM20 12h4v6h-4z" fill="white" opacity="0.9" />
              <defs>
                <linearGradient id="brand-grad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#6C63FF" />
                  <stop offset="1" stopColor="#FF6B9D" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="brand-text">
            Folio<span className="brand-accent">Builder</span>
          </span>
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/create" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Create
          </NavLink>
          
          {isLoggedIn ? (
            <div className="user-menu" ref={dropdownRef}>
              <button 
                className="user-avatar-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="user-avatar-small">{getInitial()}</span>
                <span className="user-name-text">{userName || 'User'}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu glass animate-fadeIn">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{getInitial()}</div>
                    <div>
                      <p className="dropdown-name">{userName || 'User'}</p>
                      <p className="dropdown-email">{userEmail}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <NavLink to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    👤 My Profile
                  </NavLink>
                  <NavLink to="/dashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    📋 My Portfolios
                  </NavLink>
                  <NavLink to="/create" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    ✨ Create New
                  </NavLink>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item dropdown-logout"
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = '/login';
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
