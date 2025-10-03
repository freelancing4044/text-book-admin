import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'

// Icons from Heroicons (https://heroicons.com/)
const NewsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="sidebar-options">
                                <NavLink to='/news' className={({isActive}) => isActive ? 'sidebar-option active' : 'sidebar-option'}>
                    <div className="sidebar-icon">
                        <NewsIcon />
                    </div>
                    <p>News</p>
                </NavLink>
                                <NavLink to='/users' className={({isActive}) => isActive ? 'sidebar-option active' : 'sidebar-option'}>
                    <div className="sidebar-icon">
                        <UsersIcon />
                    </div>
                    <p>Users</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar
