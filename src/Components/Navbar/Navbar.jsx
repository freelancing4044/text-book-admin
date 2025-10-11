import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onLogout = () => { 
    logout(); 
    navigate('/login', { replace: true });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className='navbar'>
        <div className='nav-container'>
          <div className='nav-left'>
            {isMobile && (
              <button className='menu-toggle' onClick={toggleMenu} aria-label='Toggle menu'>
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            )}
            <h1 className='app-title'>Admin Panel</h1>
          </div>
          
          <div className={`nav-right ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
            <div className='nav-actions'>
              <button 
                className='nav-btn' 
                onClick={onLogout}
                aria-label='Logout'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      {isMobile && (
        <div 
          className={`mobile-menu-backdrop ${isMenuOpen ? 'visible' : ''}`} 
          onClick={toggleMenu} 
        />
      )}
    </>
  );
};

export default Navbar;
