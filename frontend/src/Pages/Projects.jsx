import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Projects.css';

// Projects Data Array
const projectsList = [
  {
    id: 1,
    title: 'Portfolio Website',
    description:
      'A portfolio website displays your work, skills, and experience in a professional way. It helps you impress clients and employers.',
    category: 'web',
    image: 'images/Portfolio.jpg',
  },
  {
    id: 2,
    title: 'E-Commerce Platforms',
    description:
      'Develop powerful online stores with integrated payment systems and inventory management solutions.',
    category: 'web',
    image: 'images/E-Commerce.jpg',
  },
  {
    id: 3,
    title: 'Institute Management',
    description:
      'Manage students, courses, and registrations easily with a smart and efficient system.',
    category: 'web',
    image: 'images/Management.jpg',
  },
  {
    id: 4,
    title: 'UI/UX Design',
    description:
      'Create beautiful and intuitive user interfaces that engage users and enhance their digital experience.',
    category: 'design',
    image: 'images/UIUX.jpg',
  },
  {
    id: 5,
    title: 'Logo Design',
    description:
      'Create a unique and professional logo that represents your brand and makes a strong first impression.',
    category: 'design',
    image: 'images/Logo.jpg',
  },
  {
    id: 6,
    title: 'Mobile App Design',
    description:
      'Design user-centric mobile applications for iOS and Android with focus on usability and aesthetics.',
    category: 'design',
    image: 'images/Mobile.jpg',
  },
  {
    id: 7,
    title: 'Live Project Training',
    description:
      'Learn by working on real projects. Improve your skills with practical experience and expert guidance.',
    category: 'internship',
    image: 'images/Live Project.jpg',
  },
  {
    id: 8,
    title: 'Skill Development',
    description:
      'Comprehensive training programs covering latest technologies, soft skills, and industry best practices.',
    category: 'internship',
    image: 'images/Skill.jpg',
  },
  {
    id: 9,
    title: 'Team Collaboration',
    description:
      'Work together effectively with your team members to achieve common goals and drive innovation.',
    category: 'internship',
    image: 'images/Team.jpg',
  },
];

function Project() {
  // Read search query from URL params
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Active Category Filter State
  const [activeFilter, setActiveFilter] = useState('all');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFilterClick = (filterType) => {
    setActiveFilter(filterType);
  };

  // Filter projects by both active category & URL search query
  const filteredProjects = projectsList.filter((project) => {
    const matchesCategory =
      activeFilter === 'all' || project.category === activeFilter;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="project-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2 className="hero-title">Our Projects</h2>
          <p className="hero-subtitle">
            End-to-end solutions crafted to fit your business needs.
          </p>
        </div>
      </section>

      {/* Services & Filter Section */}
      <section className="services">
        <div className="container">
          <div className="filter-btn-container">
            <button
              className={activeFilter === 'all' ? 'btn-all active' : 'btn-all'}
              onClick={() => handleFilterClick('all')}
            >
              All Projects
            </button>
            <button
              className={activeFilter === 'web' ? 'btn-web active' : 'btn-web'}
              onClick={() => handleFilterClick('web')}
            >
              Web Development Project
            </button>
            <button
              className={
                activeFilter === 'design' ? 'btn-design active' : 'btn-design'
              }
              onClick={() => handleFilterClick('design')}
            >
              Design Project
            </button>
            <button
              className={
                activeFilter === 'internship'
                  ? 'btn-internship active'
                  : 'btn-internship'
              }
              onClick={() => handleFilterClick('internship')}
            >
              Internship Project
            </button>
          </div>

          <div className="services-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="service-card"
                  data-category={project.category}
                >
                  <div className="card-image">
                    <img src={project.image} alt={project.title} />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{project.title}</h3>
                    <p className="card-description">{project.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '40px 0',
                }}
              >
                <h3>No projects found matching "{searchQuery}"</h3>
                <p>Try searching for another topic or change category filter.</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="btn"
                  style={{ marginTop: '15px', cursor: 'pointer' }}
                >
                  View All Projects
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="team-left">
            <h2>
              Meet Our
              <br />
              Project Helpers
            </h2>
            <div className="line"></div>
            <p>
              When students create projects, two members help and guide them
              throughout the project creation process.
            </p>
            <button className="btn">READ MORE</button>
          </div>

          <div className="team-right">
            <div className="team-card">
              <img src="images/1.jpg" alt="Rahul Patel" />
              <h3>Rahul Patel</h3>
              <p>Creative Leader</p>
              <div className="social">
                <i className="fa-brands fa-facebook"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-linkedin"></i>
              </div>
            </div>

            <div className="team-card">
              <img src="images/2.jpg" alt="Neha Patel" />
              <h3>Neha Patel</h3>
              <p>Project Guide</p>
              <div className="social">
                <i className="fa-brands fa-facebook"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-linkedin"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <h2>Project Questions & Answers</h2>
        <p className="subtitle">Find answers related to our projects</p>

        <div className="faq-container">
          {[
            {
              q: 'What is a project?',
              a: 'A project is a real-world website or application created using HTML, CSS, and JavaScript.',
            },
            {
              q: 'What technologies are used in your projects?',
              a: 'We use HTML, CSS, JavaScript, PHP, and MySQL in most projects.',
            },
            {
              q: 'What kind of projects will we build?',
              a: 'Portfolio Website , Business Website , E-commerce etc..',
            },
            {
              q: 'Which software should I use for coding?',
              a: 'You should use VS Code (Visual Studio Code) — it is easy and beginner-friendly.',
            },
            {
              q: 'Are projects responsive?',
              a: 'Yes, all projects are fully responsive and mobile-friendly.',
            },
            {
              q: 'Do you provide source code?',
              a: 'Yes, full source code with explanation is provided.',
            },
            {
              q: 'Can I customize the project?',
              a: 'Yes, projects can be customized as per your requirements.',
            },
          ].map((item, index) => (
            <div className="faq-item" key={index}>
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                {item.q}
                <span>{openFaq === index ? '-' : '+'}</span>
              </div>
              {openFaq === index && (
                <div className="faq-answer">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Project;