import React, { useState, useEffect } from 'react';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [menus, setMenus] = useState([]);
    const [roleName, setRoleName] = useState('');
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [editRoleId, setEditRoleId] = useState(null);

    useEffect(() => {
        const fetchRolesAndMenus = async () => {
            const token = localStorage.getItem('token');
            const [rolesResponse, menusResponse] = await Promise.all([
                fetch('http://localhost:8080/api/auth/roles', {
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
            const rolesData = await rolesResponse.json();
            const menusData = await menusResponse.json();
            setRoles(rolesData);
            setMenus(menusData);
        };

        fetchRolesAndMenus();
    }, []);

    const handleCreateOrUpdateRole = async () => {
        const token = localStorage.getItem('token');
        const method = editRoleId ? 'PUT' : 'POST';
        const url = editRoleId ? `http://localhost:8080/api/auth/roles/${editRoleId}` : 'http://localhost:8080/api/auth/roles';
        
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
            setRoles(prevRoles => {
                if (editRoleId) {
                    return prevRoles.map(role => role._id === editRoleId ? updatedRole : role);
                } else {
                    return [...prevRoles, updatedRole];
                }
            });
            setRoleName('');
            setSelectedMenus([]);
            setEditRoleId(null);
        } else {
            console.error('Failed to create/update role');
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
