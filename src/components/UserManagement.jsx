import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});

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

        // Initialize selectedRoles state with current roles of users
        const initialSelectedRoles = usersData.reduce((acc, user) => {
          acc[user._id] = user.role ? user.role._id : rolesData[0]._id; // Default to the first role if no role is assigned
          return acc;
        }, {});
        setSelectedRoles(initialSelectedRoles);
      } else {
        console.error('Failed to fetch users or roles');
      }
    };

    fetchUsersAndRoles();
  }, []);

  const handleRoleChange = async (userId, roleId) => {
    setSelectedRoles((prevSelectedRoles) => ({
      ...prevSelectedRoles,
      [userId]: roleId
    }));

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
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: updatedUser.role } : user
        )
      );
    } else {
      console.error('Failed to update role');
      // Revert the role selection if the update fails
      setSelectedRoles((prevSelectedRoles) => ({
        ...prevSelectedRoles,
        [userId]: users.find((user) => user._id === userId).role._id
      }));
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <div>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.username} - {roles.find(role => role._id === selectedRoles[user._id])?.name}
              <select
                value={selectedRoles[user._id] || ''}
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
              >
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
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
