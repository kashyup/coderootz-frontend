import React, { useState, useEffect } from 'react';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [editRoleId, setEditRoleId] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false); // State to force re-render

  useEffect(() => {
    const fetchRolesAndMenus = async () => {
      const token = localStorage.getItem('token');
      const [rolesResponse, menusResponse] = await Promise.all([
        fetch('http://localhost:8080/api/roles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('http://localhost:8080/api/roles/menus', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);
      if (rolesResponse.ok && menusResponse.ok) {
        const rolesData = await rolesResponse.json();
        const menusData = await menusResponse.json();
        setRoles(rolesData);
        setMenus(menusData);
      } else {
        console.error('Failed to fetch roles or menus');
      }
    };

    fetchRolesAndMenus();
  }, [forceUpdate]); // Dependency on forceUpdate to trigger re-fetching roles

  const handleCreateOrUpdateRole = async () => {
    const token = localStorage.getItem('token');
    const method = editRoleId ? 'PUT' : 'POST';
    const url = editRoleId ? `http://localhost:8080/api/roles/${editRoleId}` : 'http://localhost:8080/api/roles';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: roleName, menus: selectedMenus })
      });

      if (response.ok) {
        const updatedRole = await response.json();

        // Update local state immediately with the updated role
        if (editRoleId) {
          // Update existing role
          setRoles(prevRoles => prevRoles.map(role => role._id === updatedRole._id ? updatedRole : role));
        } else {
          // Add newly created role
          setRoles(prevRoles => [...prevRoles, updatedRole]);
        }

        // Clear form fields after successful operation
        setRoleName('');
        setSelectedMenus([]);
        setEditRoleId(null);

        // Toggle forceUpdate to trigger re-render
        setForceUpdate(prev => !prev);
      } else {
        console.error('Failed to create/update role');
      }
    } catch (error) {
      console.error('Error while creating/updating role:', error);
    }
  };

  const handleMenuChange = (menuId) => {
    setSelectedMenus(prevState =>
      prevState.includes(menuId) ? prevState.filter(id => id !== menuId) : [...prevState, menuId]
    );
  };

  const handleEditRole = (role) => {
    setEditRoleId(role._id);
    setRoleName(role.name);
    setSelectedMenus(role.menus.map(menu => menu._id));
  };

  // Optional: If you want to trigger re-fetching roles periodically or on other events,
  // you can update forceUpdate state accordingly.

  return (
    <div>
      <h1>Role Management</h1>
      <div>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Role Name"
        />
        <div>
          <h2>Menus</h2>
          {menus.map(menu => (
            <div key={menu._id}>
              <input
                type="checkbox"
                checked={selectedMenus.includes(menu._id)}
                onChange={() => handleMenuChange(menu._id)}
              />
              {menu.name}
            </div>
          ))}
        </div>
        <button onClick={handleCreateOrUpdateRole}>
          {editRoleId ? 'Update Role' : 'Create Role'}
        </button>
      </div>
      <div>
        <h2>Existing Roles</h2>
        <ul>
          {roles.map(role => (
            <li key={role._id}>
              {role.name}
              <button onClick={() => handleEditRole(role)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoleManagement;
