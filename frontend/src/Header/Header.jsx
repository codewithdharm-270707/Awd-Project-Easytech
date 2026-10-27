import React, { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const currentQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const token = localStorage.getItem("token");

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  useEffect(() => {
    setSearchQuery(currentQuery);
  }, [currentQuery, location.pathname]);

  // Close sidebar and dropdown when route changes
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Lock background scroll but allow sidebar scrolling
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("sidebar-menu-open");
      document.documentElement.classList.add("sidebar-menu-open");
    } else {
      document.body.classList.remove("sidebar-menu-open");
      document.documentElement.classList.remove("sidebar-menu-open");
    }

    return () => {
      document.body.classList.remove("sidebar-menu-open");
      document.documentElement.classList.remove("sidebar-menu-open");
    };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    const targetPath = location.pathname.startsWith("/projects")
      ? "/projects"
      : "/course";

    if (value.trim()) {
      navigate(`${targetPath}?search=${encodeURIComponent(value)}`, {
        replace: true,
      });
    } else {
      navigate(targetPath, { replace: true });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <>
      <header className="header">
        {/* Logo */}
        <div className="logo">
          <Link to="/" className="logo-link" onClick={closeMenu}>
            <img
              src="/images/easytech.jpg"
              alt="EasyTech Logo"
              className="logo-image"
            />
            <span>EasyTech</span>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="search-box">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder={
                location.pathname.startsWith("/projects")
                  ? "Search projects..."
                  : "Search courses..."
              }
              aria-label="Search"
              value={searchQuery}
              onChange={handleInputChange}
            />
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav desktop-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/course" className="nav-link">
            Course
          </Link>
          <Link to="/projects" className="nav-link">
            Project
          </Link>

          {token ? (
            <button onClick={handleLogout} className="btn btn-login">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-login">
                Login
              </Link>
              <Link to="/register" className="btn btn-register">
                Register
              </Link>
            </>
          )}

          <div className="dropdown">
            <button
              className="dropbtn"
              aria-label="Open options"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
            >
              <i className="fa-solid fa-align-justify"></i>
            </button>

            <div
              className={`dropdown-content ${dropdownOpen ? "dropdown-visible" : ""}`}
            >
              {user.role === "admin" && (
                <Link to="/dashboard?tab=admin" className="dropdown-item">
                  Admin
                </Link>
              )}

              <Link to="/dashboard?tab=users" className="dropdown-item">
                User
              </Link>

              <Link to="/dashboard?tab=account" className="dropdown-item">
                My Account
              </Link>

              <div className="dropdown-divider"></div>

              <Link to="/course" className="dropdown-item">
                Course Page
              </Link>

              <Link to="/projects" className="dropdown-item">
                Project Page
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      </header>

      {/* Dark Overlay */}
      <div
        className={`sidebar-overlay ${menuOpen ? "overlay-visible" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      ></div>

      {/* Mobile Sidebar */}
      <aside className={`mobile-sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-heading">
          <span>EasyTech Menu</span>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={closeMenu}
            aria-label="Close sidebar"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Mobile Search */}
        <div className="sidebar-search">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder={
                location.pathname.startsWith("/projects")
                  ? "Search projects..."
                  : "Search courses..."
              }
              aria-label="Search courses or projects"
              value={searchQuery}
              onChange={handleInputChange}
            />
          </form>
        </div>

        {/* Main Links */}
        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link" onClick={closeMenu}>
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
          </Link>

          <Link to="/course" className="sidebar-link" onClick={closeMenu}>
            <i className="fa-solid fa-book-open"></i>
            <span>Course</span>
          </Link>

          <Link to="/projects" className="sidebar-link" onClick={closeMenu}>
            <i className="fa-solid fa-folder-open"></i>
            <span>Project</span>
          </Link>

          <div className="sidebar-divider"></div>

          {token ? (
            <button
              type="button"
              onClick={handleLogout}
              className="sidebar-link sidebar-action"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link to="/login" className="sidebar-link" onClick={closeMenu}>
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="sidebar-link sidebar-register"
                onClick={closeMenu}
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>Register</span>
              </Link>
            </>
          )}

          <div className="sidebar-divider"></div>

          {/* Account Dropdown */}
          <button
            type="button"
            className="sidebar-link sidebar-action"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <i className="fa-solid fa-table-list"></i>
            <span>More Options</span>
            <i
              className={`fa-solid ${dropdownOpen ? "fa-chevron-up" : "fa-chevron-down"} sidebar-arrow`}
            ></i>
          </button>

          {dropdownOpen && (
            <div className="sidebar-submenu">
              {user.role === "admin" && (
                <Link
                  to="/dashboard?tab=admin"
                  className="sidebar-sub-link"
                  onClick={closeMenu}
                >
                  Admin
                </Link>
              )}

              <Link
                to="/dashboard?tab=users"
                className="sidebar-sub-link"
                onClick={closeMenu}
              >
                User
              </Link>

              <Link
                to="/dashboard?tab=account"
                className="sidebar-sub-link"
                onClick={closeMenu}
              >
                My Account
              </Link>

              <Link
                to="/course"
                className="sidebar-sub-link"
                onClick={closeMenu}
              >
                Course Page
              </Link>

              <Link
                to="/projects"
                className="sidebar-sub-link"
                onClick={closeMenu}
              >
                Project Page
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Header;
