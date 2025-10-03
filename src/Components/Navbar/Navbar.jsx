import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'

const Navbar = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const onLogout = () => { logout(); navigate('/login', { replace: true }) }
  return (
    <div className='navbar'>
      <div className='nav-left'>
        <h4 className='app-title'>Admin Panel</h4>
      </div>
      <div className='nav-right'>
        <div className='nav-actions'>
          <button className='nav-btn' onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
