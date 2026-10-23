import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 1. Hook to detect current URL route
  const [searchParams] = useSearchParams();
  
  // Sync search input state with the current URL parameter
  const currentQuery = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(currentQuery);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Keep input in sync if URL changes or route changes
  useEffect(() => {
    setSearchQuery(currentQuery);
  }, [currentQuery, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // 2. Smart search based on active page
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Determine target route based on current path
    const targetPath = location.pathname.startsWith('/projects') ? '/projects' : '/course';

    if (value.trim()) {
      // Stay on /projects if on Projects page; go to /course otherwise
      navigate(`${targetPath}?search=${encodeURIComponent(value)}`, { replace: true });
    } else {
      // Clear search query
      navigate(targetPath, { replace: true });
    }
  };

  // Prevent form reload on Enter
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="logo-link">
          <img src="images/easytech.jpg" alt="EasyTech Logo" className="logo-image" />
          <span>EasyTech</span>
        </Link>
      </div>

      <div className="search-box">
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder={
              location.pathname.startsWith('/projects')
                ? "Search projects..."
                : "Search courses..."
            }
            aria-label="Search"
            value={searchQuery}
            onChange={handleInputChange}
          />
        </form>
      </div>

      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/course" className="nav-link">Course</Link>
        <Link to="/projects" className="nav-link">Project</Link>

        {token ? (
          <button onClick={handleLogout} className="btn btn-login">Logout</button>
        ) : (
          <>
            <Link to="/login" className="btn btn-login">Login</Link>
            <Link to="/register" className="btn btn-register">Register</Link>
          </>
        )}

        <div className="dropdown">
          <button className="dropbtn" aria-label="Menu">
            <i className="fa-solid fa-align-justify"></i>
          </button>
          <div className="dropdown-content">
            {user.role === 'admin' && (
              <Link to="/dashboard?tab=admin" className="dropdown-item">Admin</Link>
            )}
            <Link to="/dashboard?tab=users" className="dropdown-item">User</Link>
            <Link to="/dashboard?tab=account" className="dropdown-item">My Account</Link>
            <Link to="/course" className="dropdown-item">Course Page</Link>
            <Link to="/projects" className="dropdown-item">Project Page</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;