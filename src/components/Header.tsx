import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import "./Header.css";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsMenuOpen(false); // Close menu on logout
    await logout();
    navigate('/login');
  }

  return (
    <header className="header-container">
      <h2>Your Mood</h2>

      {user && (
        <>
          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link to="/" className="nav-link">📝 Log Mood</Link>
            <Link to="/history" className="nav-link">📊 History</Link>
          </nav>

          {/* Desktop User Section */}
          <div className="desktop-user-section">
            <img
              src={user.photoURL || ''}
              alt="avatar"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
            <span>{user.displayName}</span>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="mobile-menu">
              <div className="mobile-user-info">
                <img
                  src={user.photoURL || ''}
                  alt="avatar"
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{user.displayName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{user.email}</div>
                </div>
              </div>

              <Link
                to="/"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                📝 Log Mood
              </Link>
              <Link
                to="/history"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                📊 History
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: '0.5rem',
                  backgroundColor: '#fee2e2',
                  color: '#ef4444'
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </>
      )}
    </header>
  )
}