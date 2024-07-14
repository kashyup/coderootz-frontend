import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

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
      const usersData = await usersResponse.json();
      const rolesData = await rolesResponse.json();
      setUsers(usersData);
      setRoles(rolesData);
    };

    fetchUsersAndRoles();
  }, []);

  const handleAssignRole = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/users/${selectedUser}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ roleId: selectedRole })
    });

    if (response.ok) {
      setSelectedRole('');
      setSelectedUser('');
      const updatedUser = await response.json();
      setUsers(users.map(user => (user._id === updatedUser._id ? updatedUser : user)));
    } else {
      console.error('Failed to assign role');
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
              {user.username} - {user.role ? user.role.name : 'No Role'}
              <button onClick={() => setSelectedUser(user._id)}>Select</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedUser && (
        <div>
          <h2>Assign Role</h2>
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role._id} value={role._id}>{role.name}</option>
            ))}
          </select>
          <button onClick={handleAssignRole}>Assign Role</button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
