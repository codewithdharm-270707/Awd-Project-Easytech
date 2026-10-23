import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'account';
  const navigate = useNavigate();

  const [accountData, setAccountData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [publicUsers, setPublicUsers] = useState([]);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch User Profile
    fetch('http://localhost:5000/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAccountData(data))
      .catch(err => console.error(err));

    // Fetch Public Users List
    if (activeTab === 'users') {
      fetch('http://localhost:5000/api/users/list', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => Array.isArray(data) && setPublicUsers(data))
        .catch(err => console.error(err));
    }

    // Fetch Admin All Users
    if (activeTab === 'admin') {
      fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => Array.isArray(data) && setAllUsers(data))
        .catch(err => console.error(err));
    }
  }, [activeTab, token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/user/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(accountData)
    });
    if (res.ok) {
      alert('Account updated successfully!');
      setIsEditingAccount(false);
    }
  };

  const handleAdminUserUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/admin/users/${editingUser._id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(editingUser)
    });

    if (res.ok) {
      const updated = await res.json();
      setAllUsers(allUsers.map(u => u._id === updated._id ? updated : u));
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setAllUsers(allUsers.filter(u => u._id !== id));
    }
  };

  return (
    <div className="layout-wrapper">
      {/* --- LEFT SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <i className="fa-solid fa-graduation-cap brand-icon"></i>
          <span>Easy Skill</span>
        </div>

        <nav className="sidebar-menu">
          <Link to="/dashboard?tab=account" className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}>
            <i className="fa-regular fa-user"></i>
            <span>My Account</span>
          </Link>

          <Link to="/dashboard?tab=users" className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}>
            <i className="fa-solid fa-users"></i>
            <span>Users</span>
          </Link>

          {accountData?.role === 'admin' && (
            <Link to="/dashboard?tab=admin" className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}>
              <i className="fa-solid fa-user-shield"></i>
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="main-viewport">
        {/* TOP WELCOME HEADER */}
        <header className="top-banner">
          <h1 className="welcome-heading">Welcome, {accountData?.full_name || 'User'}</h1>
          <div className="role-pill">
            <i className="fa-solid fa-user-tie"></i>
            <span>Role: {accountData?.role?.toUpperCase() || 'USER'}</span>
          </div>
        </header>

        {/* 1. MY ACCOUNT PANEL */}
        {activeTab === 'account' && accountData && (
          <div className="premium-card">
            <div className="card-header">
              <h2><i className="fa-solid fa-id-card"></i> Personal Information</h2>
            </div>

            {!isEditingAccount ? (
              <div className="profile-grid">
                <div className="info-box">
                  <label>Full Name</label>
                  <p>{accountData.full_name}</p>
                </div>
                <div className="info-box">
                  <label>Email Address</label>
                  <p>{accountData.email}</p>
                </div>
                <div className="info-box">
                  <label>Phone Number</label>
                  <p>{accountData.phone || 'N/A'}</p>
                </div>
                <div className="info-box">
                  <label>Age</label>
                  <p>{accountData.age || 'N/A'}</p>
                </div>
                <div className="info-box">
                  <label>Gender</label>
                  <p>{accountData.gender || 'N/A'}</p>
                </div>
                <div className="info-box">
                  <label>Enrolled Course</label>
                  <p>{accountData.course || 'N/A'}</p>
                </div>
                <div className="info-box">
                  <label>Time Slot</label>
                  <p>{accountData.time_slot || 'N/A'}</p>
                </div>

                <div className="full-width-actions">
                  <button className="btn-primary" onClick={() => setIsEditingAccount(true)}>
                    <i className="fa-solid fa-pen-to-square"></i> Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAccountUpdate} className="modern-form compact-form">
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={accountData.full_name || ''} 
                      onChange={e => setAccountData({...accountData, full_name: e.target.value})} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="text" 
                      value={accountData.phone || ''} 
                      onChange={e => setAccountData({...accountData, phone: e.target.value})} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Age</label>
                    <input 
                      type="number" 
                      value={accountData.age || ''} 
                      onChange={e => setAccountData({...accountData, age: e.target.value})} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <select 
                      value={accountData.gender || ''} 
                      onChange={e => setAccountData({...accountData, gender: e.target.value})}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Course</label>
                    <select 
                      value={accountData.course || ''} 
                      onChange={e => setAccountData({...accountData, course: e.target.value})}
                    >
                      <option value="Data Science">Data Science</option>
                      <option value="Data Analytics">Data Analytics</option>
                      <option value="Web Designing">Web Designing</option>
                      <option value="Software Development">Software Development</option>
                      <option value="Full Stack Development">Full Stack Development</option>
                      <option value="Graphic Designing">Graphic Designing</option>
                      <option value="Cyber Security">Cyber Security</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Time Slot</label>
                    <select 
                      value={accountData.time_slot || ''} 
                      onChange={e => setAccountData({...accountData, time_slot: e.target.value})}
                    >
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions align-right">
                  <button type="submit" className="btn-primary">Save Changes</button>
                  <button type="button" className="btn-secondary" onClick={() => setIsEditingAccount(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 2. USER PANEL */}
        {activeTab === 'users' && (
          <div className="premium-card">
            <div className="card-header">
              <div>
                <h2><i className="fa-solid fa-users"></i> Registered Students</h2>
                <p className="subtitle">List of all students enrolled in Easy Skill:</p>
              </div>
            </div>

            <table className="modern-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Time Slot</th>
                </tr>
              </thead>
              <tbody>
                {publicUsers.map((user, index) => (
                  <tr key={user._id || index}>
                    <td className="row-id">#{index + 1}</td>
                    <td className="font-semibold">{user.full_name}</td>
                    <td>{user.course || 'N/A'}</td>
                    <td>{user.time_slot || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. ADMIN PANEL */}
        {activeTab === 'admin' && (
          <div className="premium-card">
            <div className="card-header space-between">
              <h2><i className="fa-solid fa-user-gear"></i> Admin Control Panel</h2>
              <button className="btn-primary" onClick={() => navigate('/register')}>
                <i className="fa-solid fa-plus"></i> Add New Student
              </button>
            </div>

            <table className="modern-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Course</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u, index) => (
                  <tr key={u._id}>
                    <td className="row-id">#{index + 1}</td>
                    <td className="font-semibold">{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>{u.course || 'N/A'}</td>
                    <td>
                      <span className={`badge ${u.role}`}>{u.role?.toUpperCase()}</span>
                    </td>
                    <td className="action-cells">
                      <button className="action-btn edit" onClick={() => setEditingUser(u)}>
                        <i className="fa-solid fa-pen-to-square"></i> Edit
                      </button>
                      <button className="action-btn delete" onClick={() => handleDeleteUser(u._id)}>
                        <i className="fa-solid fa-trash-can"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- EDIT MODAL --- */}
        {editingUser && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Edit Student Information</h3>
              <form onSubmit={handleAdminUserUpdate}>
                <label>Full Name</label>
                <input type="text" value={editingUser.full_name} onChange={e => setEditingUser({...editingUser, full_name: e.target.value})} required />

                <label>Email</label>
                <input type="email" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} required />

                <label>Phone</label>
                <input type="text" value={editingUser.phone || ''} onChange={e => setEditingUser({...editingUser, phone: e.target.value})} />

                <label>Course</label>
                <input type="text" value={editingUser.course || ''} onChange={e => setEditingUser({...editingUser, course: e.target.value})} />

                <label>Role</label>
                <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>

                <div className="modal-actions">
                  <button type="submit" className="btn-primary">Save Changes</button>
                  <button type="button" className="btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;