import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menus, setMenus] = useState([]);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenusAndRole = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await fetch('http://localhost:8080/api/roles/menus', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const menusData = await response.json();

      const userResponse = await fetch('http://localhost:8080/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const userData = await userResponse.json();

      setMenus(menusData);
      setUserRole(userData.role.name);
    };

    fetchMenusAndRole();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav>
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
