import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userRole, menus }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
