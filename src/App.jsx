import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import UserManagement from './components/UserManagement';
import RoleManagement from './components/RoleManagement';

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [menus, setMenus] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserRoleAndMenus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:8080/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUserRole(userData.role.name);
          setMenus(userData.menus);
          setIsAuthenticated(true);
        }
      }
    };

    fetchUserRoleAndMenus();
  }, []); // Empty dependency array to ensure this runs only once on mount

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <Home userRole={userRole} menus={menus} />
          </PrivateRoute>
        } />
        <Route path="/user-management" element={
          <PrivateRoute>
            <UserManagement />
          </PrivateRoute>
        } />
        <Route path="/role-management" element={
          <PrivateRoute>
            <RoleManagement />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
