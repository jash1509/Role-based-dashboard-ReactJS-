import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

function TableAvatar({ src, firstName, lastName }) {
  const [error, setError] = useState(false);
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || firstName?.[1] || ''}`.toUpperCase();

  if (error || !src) {
    return (
      <div className="avatar avatar-sm" style={{ fontWeight: 600, fontSize: '0.8rem' }} title={`${firstName} ${lastName}`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${firstName} ${lastName}`}
      className="table-avatar"
      onError={() => setError(true)}
    />
  );
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const data = await authAPI.getUsers();
      setUsers(data.data || []);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setDeleteConfirm(null);
  };

  const handleToggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    );
  };

  return (
    <div id="manage-users-page">
      <header className="page-header">
        <p className="page-greeting">Administration</p>
        <h1 className="page-title">
          Manage <span>Users</span> 👥
        </h1>
      </header>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="search-wrapper">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="search-users"
          />
        </div>
        <div className="table-toolbar-info">
          <span className="badge badge-primary">{filteredUsers.length} users</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="content-card">
        {loading ? (
          <div className="table-loading">
            <div className="loading-spinner" style={{ width: '24px', height: '24px' }} />
            <span>Loading users...</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table" aria-label="Users table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="table-user">
                        <TableAvatar
                          src={u.avatar}
                          firstName={u.first_name}
                          lastName={u.last_name}
                        />
                        <span className="table-user-name">{u.first_name} {u.last_name}</span>
                      </div>
                    </td>
                    <td className="table-email">{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleToggleStatus(u.id)}
                          title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {u.status === 'active' ? '⏸' : '▶️'}
                        </button>
                        {deleteConfirm === u.id ? (
                          <div className="delete-confirm">
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(u.id)}
                            >
                              Confirm
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-outline btn-sm btn-delete"
                            onClick={() => setDeleteConfirm(u.id)}
                            title="Delete user"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="table-empty">
                      No users found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
