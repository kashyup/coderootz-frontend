import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      const token = localStorage.getItem('token');
      const [usersResponse, rolesResponse] = await Promise.all([
        fetch('http://localhost:8080/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('http://localhost:8080/api/roles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);
      if (usersResponse.ok && rolesResponse.ok) {
        const usersData = await usersResponse.json();
        const rolesData = await rolesResponse.json();
        setUsers(usersData);
        setRoles(rolesData);
      } else {
        console.error('Failed to fetch users or roles');
      }
    };

    fetchUsersAndRoles();
  }, []);

  const handleRoleChange = async (userId, roleId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ roleId })
    });
    if (response.ok) {
      const updatedUser = await response.json();
      setUsers(prevUsers => prevUsers.map(user => user._id === userId ? updatedUser : user));
    } else {
      console.error('Failed to update role');
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <div>
        <h2>Users</h2>
        <ul>
          {users.map(user => (
            <li key={user._id}>
              {user.username} - {user.role.name}
              <select value={selectedRoleId} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role._id} value={role._id}>{role.name}</option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;
