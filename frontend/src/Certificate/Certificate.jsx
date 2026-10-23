import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Certificate.css';

const Certificate = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/'); // Navigates to Home route smoothly using React Router
  };

  return (
    <div className="certificate-page-wrapper">
      <div className="button-container">
        <button className="back-btn" onClick={handleBackToHome}>
          &larr; Back to Home
        </button>
      </div>

      <div className="certificate">
        <div className="corner1"></div>
        <div className="corner2"></div>

        <div className="watermark">ET</div>

        <div className="top">
          <div className="logo">ET</div>
          <div className="academy">EasyTech Academy</div>
          <div className="subtitle">INFORMATION & TECHNOLOGY INSTITUTE</div>
        </div>

        <div className="content">
          <div className="title">Certificate of Completion</div>
          <div className="present">This Certificate is Proudly Presented To</div>
          <div className="student">PRIYANSH PATEL</div>

          <div className="complete">
            For successfully completing the professional training program in
          </div>

          <div className="course">FULL STACK WEB DEVELOPMENT</div>

          <div className="details">
            <div className="box">
              <h3>Course Details</h3>
              <p><b>Duration :</b> 6 Months</p>
              <p><b>Mode :</b> Offline</p>
              <p><b>Date :</b> 21 July 2026</p>
            </div>

            <div className="box">
              <h3>Final Project</h3>
              <p>
                Developed a responsive Full Stack Web Application using HTML, CSS,
                JavaScript, Bootstrap, PHP, MySQL, and modern web technologies.
              </p>
            </div>
          </div>

          <div className="skills">
            <h2>Skills Achieved</h2>
            <div className="skill-list">
              <div className="skill">HTML5</div>
              <div className="skill">CSS3</div>
              <div className="skill">JavaScript</div>
              <div className="skill">Bootstrap</div>
              <div className="skill">PHP</div>
              <div className="skill">MySQL</div>
              <div className="skill">Git & GitHub</div>
              <div className="skill">Responsive Design</div>
            </div>
          </div>

          <div className="bottom">
            <div className="sign">
              PHD
              <div className="line"></div>
              Signature of Instructor.
            </div>

            <div className="sign">
              PRIYANSH
              <div className="line"></div>
              Signature of Director.
            </div>
          </div>
        </div>

        <div className="footer">
          Empowering Future IT Professionals | www.easytechacademy.com
        </div>
      </div>
    </div>
  );
};

export default Certificate;