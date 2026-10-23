import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <p>Top companies choose EasyTech to build in-demand career skills.</p>
      </div>

      <div className="footer-container">
        <div className="column">
          <h3>In-demand Careers</h3>
          <a href="#">Data Scientist</a>
          <a href="#">Full Stack Developer</a>
          <a href="#">Cloud Engineer</a>
          <a href="#">Project Manager</a>
        </div>

        <div className="column">
          <h3>Web Development</h3>
          <a href="#">JavaScript</a>
          <a href="#">React JS</a>
          <a href="#">Angular</a>
          <a href="#">Java</a>
        </div>

        <div className="column">
          <h3>IT Certifications</h3>
          <a href="#">AWS</a>
          <a href="#">Azure</a>
          <a href="#">Kubernetes</a>
        </div>

        <div className="column">
          <h3>Leadership</h3>
          <a href="#">Management</a>
          <a href="#">Project Management</a>
          <a href="#">Productivity</a>
        </div>

        <div className="column">
          <h3>Data Science</h3>
          <a href="#">Python</a>
          <a href="#">Machine Learning</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          <i className="fa-regular fa-copyright"></i> {new Date().getFullYear()} EasyTech | All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;