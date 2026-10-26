
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

const DEFAULT_COURSES = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'React JS',
  'Node JS',
  'PHP & MySQL',
  'Python Programming',
  'Java Programming',
  'UI/UX Design',
  'Graphic Design',
  'Logo Design',
  'Android Development',
  'iOS Development',
  'Data Science',
  'Data Analytics',
];

const API_URL = 'https://awd-project-easytech.onrender.com';

const getAcademyCourses = () => {
  try {
    const savedCourses = JSON.parse(
      localStorage.getItem('academyCourses') || '[]'
    );

    const savedDeletedCourses = JSON.parse(
      localStorage.getItem('academyDeletedCourses') || '[]'
    );

    const customCourses = Array.isArray(savedCourses)
      ? savedCourses
      : [];

    const deletedCourses = Array.isArray(savedDeletedCourses)
      ? savedDeletedCourses
      : [];

    const deletedNames = new Set(
      deletedCourses.map(course =>
        String(course).trim().toLowerCase()
      )
    );

    const customCourseNames = customCourses
      .map(course =>
        String(course?.courseName || course?.title || '').trim()
      )
      .filter(Boolean);

    const allCourses = [
      ...new Set([...DEFAULT_COURSES, ...customCourseNames]),
    ];

    return allCourses.filter(
      course => !deletedNames.has(course.trim().toLowerCase())
    );
  } catch (error) {
    console.error('Course loading error:', error);
    return DEFAULT_COURSES;
  }
};

const getCourseCategory = course => {
  const name = course.toLowerCase();

  if (name.includes('design') || name.includes('logo')) {
    return 'Design';
  }

  if (
    name.includes('android') ||
    name.includes('ios') ||
    name.includes('app')
  ) {
    return 'App Development';
  }

  if (
    name.includes('data science') ||
    name.includes('data analytics')
  ) {
    return 'Data & Analytics';
  }

  return 'Development & Programming';
};

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'account';
  const navigate = useNavigate();

  const [accountData, setAccountData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [adminSearch, setAdminSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const [academyCourses, setAcademyCourses] = useState(
    getAcademyCourses
  );

  const [announcements, setAnnouncements] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isPostingNote, setIsPostingNote] = useState(false);
  const [announcementError, setAnnouncementError] = useState('');

  const token = localStorage.getItem('token');
  const isAdmin = accountData?.role === 'admin';

  const getHeaders = (includeJson = false) => {
    const headers = {
      Authorization: `Bearer ${token || ''}`,
    };

    if (includeJson) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  };

  // Refresh course list when localStorage changes.
  useEffect(() => {
    const refreshCourses = () => {
      setAcademyCourses(getAcademyCourses());
    };

    window.addEventListener('focus', refreshCourses);
    window.addEventListener('storage', refreshCourses);
    window.addEventListener('academyCoursesUpdated', refreshCourses);

    return () => {
      window.removeEventListener('focus', refreshCourses);
      window.removeEventListener('storage', refreshCourses);
      window.removeEventListener(
        'academyCoursesUpdated',
        refreshCourses
      );
    };
  }, []);

  // 1. Fetch profile.
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/profile`, {
          headers: getHeaders(),
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            return;
          }

          throw new Error('Profile fetch failed');
        }

        const data = await res.json();
        setAccountData(data);
      } catch (error) {
        console.error('Profile error:', error);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  // 2. Restrict tabs by role.
  useEffect(() => {
    if (!accountData) return;

    if (accountData.role === 'admin') {
      const allowedTabs = ['admin', 'courses', 'announcements'];

      if (!allowedTabs.includes(activeTab)) {
        navigate('/dashboard?tab=admin', { replace: true });
      }
    } else {
      const allowedTabs = ['account', 'announcements'];

      if (!allowedTabs.includes(activeTab)) {
        navigate('/dashboard?tab=account', { replace: true });
      }
    }
  }, [accountData, activeTab, navigate]);

  // 3. Fetch admin users.
  useEffect(() => {
    if (
      !['admin', 'courses', 'announcements'].includes(activeTab) ||
      !isAdmin ||
      !token
    ) {
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/users`, {
          headers: getHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Admin users fetch failed');
        }

        setAllUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Admin users error:', error);
      }
    };

    fetchUsers();
  }, [activeTab, isAdmin, token]);

  // 4. Fetch announcements for logged-in users.
  useEffect(() => {
    if (
      activeTab !== 'announcements' ||
      !token ||
      !accountData
    ) {
      return;
    }

    const controller = new AbortController();

    const fetchAnnouncements = async () => {
      setAnnouncementError('');

      try {
        const res = await fetch(`${API_URL}/api/announcements`, {
          method: 'GET',
          headers: getHeaders(),
          signal: controller.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
              `Announcement request failed (${res.status})`
          );
        }

        const list = Array.isArray(data.announcements)
          ? data.announcements
          : Array.isArray(data)
          ? data
          : [];

        setAnnouncements(list);
      } catch (error) {
        if (error.name === 'AbortError') return;

        console.error('Announcements error:', error);
        setAnnouncementError(error.message);
      }
    };

    fetchAnnouncements();

    return () => controller.abort();
  }, [activeTab, token, accountData]);

  // 5. Filter students.
  const filteredUsers = useMemo(() => {
    const query = adminSearch.trim().toLowerCase();

    if (!query) return allUsers;

    return allUsers.filter(
      user =>
        (user.full_name || '').toLowerCase().includes(query) ||
        (user.course || '').toLowerCase().includes(query) ||
        (user.email || '').toLowerCase().includes(query)
    );
  }, [allUsers, adminSearch]);

  const matchingCourseCount = useMemo(() => {
    const query = adminSearch.trim().toLowerCase();

    if (!query) return null;

    const matchingCourse = academyCourses.find(
      course => course.toLowerCase() === query
    );

    if (!matchingCourse) return null;

    return allUsers.filter(
      user =>
        (user.course || '').trim().toLowerCase() ===
        matchingCourse.toLowerCase()
    ).length;
  }, [allUsers, adminSearch, academyCourses]);

  // 6. Logout.
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // 7. Post announcement - ADMIN ONLY.
  const handlePostAnnouncement = async e => {
    e.preventDefault();

    if (!isAdmin) return;

    if (!newTitle.trim() || !newNote.trim()) {
      setAnnouncementError('Please enter both title and message.');
      return;
    }

    if (!token) {
      setAnnouncementError('Please log in again.');
      return;
    }

    setIsPostingNote(true);
    setAnnouncementError('');

    try {
      const res = await fetch(`${API_URL}/api/announcements`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({
          title: newTitle.trim(),
          message: newNote.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            `Announcement publish failed (${res.status})`
        );
      }

      const createdAnnouncement = data.announcement || data;

      setAnnouncements(prev => [createdAnnouncement, ...prev]);
      setNewTitle('');
      setNewNote('');

      alert('Announcement published successfully!');
    } catch (error) {
      console.error('Post announcement error:', error);
      setAnnouncementError(
        error.message || 'Unable to post announcement.'
      );
    } finally {
      setIsPostingNote(false);
    }
  };

  // 8. Delete announcement - ADMIN ONLY.
  const handleDeleteAnnouncement = async id => {
    // Extra protection: only admin can call this handler.
    if (!isAdmin || !id) return;

    if (
      !window.confirm(
        'Are you sure you want to delete this announcement?'
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/announcements/${id}`,
        {
          method: 'DELETE',
          headers: getHeaders(),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || 'Announcement delete failed'
        );
      }

      setAnnouncements(prev =>
        prev.filter(note => note._id !== id)
      );

      alert('Announcement deleted successfully!');
    } catch (error) {
      console.error('Delete announcement error:', error);
      alert(error.message || 'Unable to delete announcement.');
    }
  };

  // 9. Update student.
  const handleAdminUserUpdate = async e => {
    e.preventDefault();

    if (!isAdmin || !editingUser) return;

    try {
      const res = await fetch(
        `${API_URL}/api/admin/users/${editingUser._id}`,
        {
          method: 'PUT',
          headers: getHeaders(true),
          body: JSON.stringify(editingUser),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'User update failed');
      }

      setAllUsers(prev =>
        prev.map(user => (user._id === data._id ? data : user))
      );

      setEditingUser(null);
      alert('Student updated successfully!');
    } catch (error) {
      console.error('Update user error:', error);
      alert(error.message || 'Unable to update student.');
    }
  };

  // 10. Delete student.
  const handleDeleteUser = async id => {
    if (!isAdmin || !id) return;

    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Delete failed');
      }

      setAllUsers(prev => prev.filter(user => user._id !== id));
      alert('Student deleted successfully!');
    } catch (error) {
      console.error('Delete user error:', error);
      alert(error.message || 'Unable to delete student.');
    }
  };

  // 11. Delete course.
  const handleDeleteCourse = courseName => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${courseName}"?`
    );

    if (!confirmed) return;

    try {
      const savedCourses = JSON.parse(
        localStorage.getItem('academyCourses') || '[]'
      );

      const savedDeletedCourses = JSON.parse(
        localStorage.getItem('academyDeletedCourses') || '[]'
      );

      const customCourses = Array.isArray(savedCourses)
        ? savedCourses
        : [];

      const deletedCourses = Array.isArray(savedDeletedCourses)
        ? savedDeletedCourses
        : [];

      const normalizedName = courseName.trim().toLowerCase();

      const isDefaultCourse = DEFAULT_COURSES.some(
        course => course.trim().toLowerCase() === normalizedName
      );

      if (isDefaultCourse) {
        const alreadyDeleted = deletedCourses.some(
          course =>
            String(course).trim().toLowerCase() === normalizedName
        );

        if (!alreadyDeleted) {
          deletedCourses.push(courseName);
        }

        localStorage.setItem(
          'academyDeletedCourses',
          JSON.stringify(deletedCourses)
        );
      } else {
        const updatedCustomCourses = customCourses.filter(course => {
          const name = String(
            course?.courseName || course?.title || ''
          )
            .trim()
            .toLowerCase();

          return name !== normalizedName;
        });

        localStorage.setItem(
          'academyCourses',
          JSON.stringify(updatedCustomCourses)
        );
      }

      setAcademyCourses(getAcademyCourses());
      window.dispatchEvent(new Event('academyCoursesUpdated'));

      alert('Course deleted successfully!');
    } catch (error) {
      console.error('Delete course error:', error);
      alert('Unable to delete course.');
    }
  };

  return (
    <div className="layout-wrapper">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <i className="fa-solid fa-graduation-cap brand-icon"></i>
          <span>Easy Skill</span>
        </div>

        <nav className="sidebar-menu">
          {isAdmin ? (
            <>
              <Link
                to="/dashboard?tab=admin"
                className={`nav-item ${
                  activeTab === 'admin' ? 'active' : ''
                }`}
              >
                <i className="fa-solid fa-user-shield"></i>
                <span>Admin Panel</span>
              </Link>

              <Link
                to="/dashboard?tab=courses"
                className={`nav-item ${
                  activeTab === 'courses' ? 'active' : ''
                }`}
              >
                <i className="fa-solid fa-book-open"></i>
                <span>Courses</span>
              </Link>

              <Link
                to="/dashboard?tab=announcements"
                className={`nav-item ${
                  activeTab === 'announcements' ? 'active' : ''
                }`}
              >
                <i className="fa-solid fa-bullhorn"></i>
                <span>Announcements</span>
              </Link>
            </>
          ) : accountData ? (
            <>
              <Link
                to="/dashboard?tab=account"
                className={`nav-item ${
                  activeTab === 'account' ? 'active' : ''
                }`}
              >
                <i className="fa-regular fa-user"></i>
                <span>My Account</span>
              </Link>

              <Link
                to="/dashboard?tab=announcements"
                className={`nav-item ${
                  activeTab === 'announcements' ? 'active' : ''
                }`}
              >
                <i className="fa-solid fa-bullhorn"></i>
                <span>Announcements</span>
              </Link>
            </>
          ) : null}
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </aside>

      <main className="main-viewport">
        <header className="top-banner">
          <h1 className="welcome-heading">
            Welcome, {accountData?.full_name || 'User'}
          </h1>

          <div className="role-pill">
            <i className="fa-solid fa-user-tie"></i>
            <span>
              Role: {accountData?.role?.toUpperCase() || 'USER'}
            </span>
          </div>
        </header>

        {/* USER ACCOUNT */}
        {activeTab === 'account' && accountData && !isAdmin && (
          <div className="premium-card">
            <div className="card-header">
              <div>
                <h2>
                  <i className="fa-solid fa-id-card"></i> Personal
                  Information
                </h2>
                <p className="subtitle">Your account details.</p>
              </div>
            </div>

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
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="premium-card">
            <div className="card-header">
              <div>
                <h2>
                  <i className="fa-solid fa-bullhorn"></i> Announcements
                </h2>

                <p className="subtitle">
                  {isAdmin
                    ? 'Post important notes for all students.'
                    : 'Latest notes from the academy admin.'}
                </p>
              </div>
            </div>

            {/* Only ADMIN can post announcements */}
            {isAdmin && (
              <form
                onSubmit={handlePostAnnouncement}
                className="modern-form"
                style={{ marginBottom: '22px' }}
              >
                <div className="form-group">
                  <label>Announcement Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Holiday Notice / Exam Schedule"
                    required
                  />
                </div>

                <div
                  className="form-group"
                  style={{ marginTop: '14px' }}
                >
                  <label>Announcement Message</label>
                  <textarea
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Write a note for all students..."
                    rows={3}
                    required
                  />
                </div>

                {announcementError && (
                  <p
                    role="alert"
                    style={{ color: '#dc2626', marginTop: 12 }}
                  >
                    {announcementError}
                  </p>
                )}

                <div className="form-actions align-right">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={
                      isPostingNote ||
                      !newTitle.trim() ||
                      !newNote.trim()
                    }
                  >
                    <i className="fa-solid fa-paper-plane"></i>{' '}
                    {isPostingNote ? 'Posting...' : 'Post Announcement'}
                  </button>
                </div>
              </form>
            )}

            <div className="announcements-list">
              {announcementError && announcements.length === 0 ? (
                <p className="subtitle">
                  Unable to load announcements: {announcementError}
                </p>
              ) : announcements.length === 0 ? (
                <p className="subtitle">No announcements yet.</p>
              ) : (
                announcements.map((note, index) => (
                  <div
                    key={note._id || index}
                    className="announcement-item"
                    style={{
                      background: '#f8f9fe',
                      border: '1px solid var(--border)',
                      borderLeft: '4px solid #ef4444',
                      borderRadius: '10px',
                      padding: '16px 18px',
                      marginBottom: '14px',
                    }}
                  >
                    {note.title && (
                      <h4 style={{ marginBottom: 6 }}>
                        {note.title}
                      </h4>
                    )}

                    <p style={{ whiteSpace: 'pre-wrap' }}>
                      {note.message}
                    </p>

                    <p className="subtitle" style={{ marginTop: 8 }}>
                      — {note.author || 'Admin'}{' '}
                      {note.createdAt &&
                        `• ${new Date(note.createdAt).toLocaleString()}`}
                    </p>

                    {/* Delete button is rendered ONLY for admin */}
                    {isAdmin && note._id && (
                      <button
                        type="button"
                        className="action-btn delete"
                        onClick={() =>
                          handleDeleteAnnouncement(note._id)
                        }
                      >
                        <i className="fa-solid fa-trash-can"></i>{' '}
                        Delete
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ADMIN PANEL */}
        {activeTab === 'admin' && isAdmin && (
          <div className="premium-card">
            <div className="card-header space-between">
              <div>
                <h2>
                  <i className="fa-solid fa-user-gear"></i> Admin
                  Control Panel
                </h2>

                <p className="subtitle">
                  Search, edit, or delete students by name, course, or email.
                </p>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate('/register')}
              >
                <i className="fa-solid fa-plus"></i> Add Student
              </button>
            </div>

            <div className="admin-search-section">
              <input
                type="search"
                className="admin-search-input"
                placeholder="Search student name, course, or email..."
                value={adminSearch}
                onChange={e => setAdminSearch(e.target.value)}
                aria-label="Search students"
              />

              <p className="subtitle">
                Matching students: <strong>{filteredUsers.length}</strong>
              </p>

              {matchingCourseCount !== null && (
                <p className="subtitle">
                  Students enrolled in "{adminSearch.trim()}":{' '}
                  <strong>{matchingCourseCount}</strong>
                </p>
              )}
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
                {filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td className="row-id">#{index + 1}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{user.course || 'N/A'}</td>
                    <td>
                      <span className={`badge ${user.role}`}>
                        {user.role?.toUpperCase()}
                      </span>
                    </td>
                    <td className="action-cells">
                      <button
                        type="button"
                        className="action-btn edit"
                        onClick={() => setEditingUser(user)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>{' '}
                        Edit
                      </button>

                      <button
                        type="button"
                        className="action-btn delete"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <i className="fa-solid fa-trash-can"></i>{' '}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7">No matching students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ADMIN COURSES */}
        {activeTab === 'courses' && isAdmin && (
          <div className="premium-card">
            <div className="card-header">
              <div>
                <h2>
                  <i className="fa-solid fa-book-open"></i> Easy Skill
                  Academy Courses
                </h2>

                <p className="subtitle">
                  All courses offered by our academy.
                </p>
              </div>

              <div className="course-header-actions">
                <span className="role-pill">
                  {academyCourses.length} Courses
                </span>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => navigate('/add-course')}
                >
                  <i className="fa-solid fa-plus"></i> Add to Course
                </button>
              </div>
            </div>

            <table className="modern-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course Name</th>
                  <th>Category</th>
                  <th>Enrolled Students</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {academyCourses.map((course, index) => {
                  const studentCount = allUsers.filter(
                    user =>
                      (user.course || '').trim().toLowerCase() ===
                      course.toLowerCase()
                  ).length;

                  return (
                    <tr key={course}>
                      <td className="row-id">#{index + 1}</td>
                      <td>{course}</td>
                      <td>{getCourseCategory(course)}</td>
                      <td>{studentCount}</td>
                      <td>
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => handleDeleteCourse(course)}
                        >
                          <i className="fa-solid fa-trash-can"></i>{' '}
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {academyCourses.length === 0 && (
                  <tr>
                    <td colSpan="5">No courses available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* EDIT STUDENT MODAL */}
        {editingUser && isAdmin && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Edit Student Information</h3>

              <form onSubmit={handleAdminUserUpdate}>
                <label>Full Name</label>
                <input
                  type="text"
                  value={editingUser.full_name || ''}
                  onChange={e =>
                    setEditingUser({
                      ...editingUser,
                      full_name: e.target.value,
                    })
                  }
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={e =>
                    setEditingUser({
                      ...editingUser,
                      email: e.target.value,
                    })
                  }
                  required
                />

                <label>Phone</label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={e =>
                    setEditingUser({
                      ...editingUser,
                      phone: e.target.value,
                    })
                  }
                />

                <label>Course</label>
                <select
                  value={editingUser.course || ''}
                  onChange={e =>
                    setEditingUser({
                      ...editingUser,
                      course: e.target.value,
                    })
                  }
                >
                  <option value="">Select Course</option>

                  {academyCourses.map(course => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>

                <label>Role</label>
                <select
                  value={editingUser.role || 'user'}
                  onChange={e =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>

                <div className="modal-actions">
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>
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
