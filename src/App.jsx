import React from 'react';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import News from './pages/News/News';
import Users from './pages/Users/Users';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

const App = () => {
  // for testing
  const url = 'https://text-book-backend.onrender.com';
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {isLoginPage ? (
        <Routes>
          <Route path='/login' element={<Login url={url} />} />
        </Routes>
      ) : (
        <>
          <Navbar />
          <div className="app-content">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path='/' element={<ProtectedRoute><News url={url} /></ProtectedRoute>} />
                <Route path='/news' element={<ProtectedRoute><News url={url} /></ProtectedRoute>} />
                <Route path='/users' element={<ProtectedRoute><Users url={url} /></ProtectedRoute>} />
                <Route path='*' element={<Navigate to='/' />} />
              </Routes>
            </div>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
