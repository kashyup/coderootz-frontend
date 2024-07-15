import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userRole, menus, handleLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <nav className={`navbar ${collapsed ? 'collapsed' : ''}`}>
      <div className="collapse-icon" onClick={toggleCollapse}>
        <span>{collapsed ? '▶' : '◀'}</span>
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
