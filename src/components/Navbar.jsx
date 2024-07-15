import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';  // Assuming you have a CSS file for styling

const Navbar = ({ userRole, menus }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="collapse-icon">
        <span>≡</span>
      </div>
      <ul>
        {menus.map(menu => (
          <li key={menu._id}><Link to={menu.path}>{menu.name}</Link></li>
        ))}
        {userRole === 'Superadmin' && (
          <>
            <li><Link to="/user-management">User Management</Link></li>
            <li><Link to="/role-management">Role Management</Link></li>
          </>
        )}
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
