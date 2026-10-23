import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Course.css';

// Courses Data Array
const coursesList = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Build responsive UI using HTML, CSS, and JavaScript.',
    category: 'web',
    image: 'images/frontend.jpg',
  },
  {
    id: 'backend',
    title: 'Backend Development',
    description: 'Learn server-side development, APIs, and databases.',
    category: 'web',
    image: 'images/backend.jpg',
  },
  {
    id: 'fullstack',
    title: 'Full Stack Development',
    description: 'Become expert in frontend and backend technologies.',
    category: 'web',
    image: 'images/fullstack.jpg',
  },
  {
    id: 'react',
    title: 'React JS',
    description: 'Build modern and dynamic web applications using React.',
    category: 'web',
    image: 'images/react.jpg',
  },
  {
    id: 'node',
    title: 'Node JS',
    description: 'Create backend applications using JavaScript runtime.',
    category: 'web',
    image: 'images/node.jpg',
  },
  {
    id: 'php',
    title: 'PHP & MySQL',
    description: 'Develop dynamic websites with database integration.',
    category: 'web',
    image: 'images/php.jpg',
  },
  {
    id: 'python',
    title: 'Python Programming',
    description: 'Learn easy and powerful programming language.',
    category: 'web',
    image: 'images/python.jpg',
  },
  {
    id: 'java',
    title: 'Java Programming',
    description: 'Learn object-oriented programming concepts.',
    category: 'web',
    image: 'images/java.jpg',
  },
  {
    id: 'uiux',
    title: 'UI/UX Design',
    description: 'Learn to design modern user interfaces using Figma.',
    category: 'design',
    image: 'images/UIUX.jpg',
  },
  {
    id: 'graphic',
    title: 'Graphic Design',
    description: 'Create posters and banners using Photoshop & Illustrator.',
    category: 'design',
    image: 'images/graphic.jpg',
  },
  {
    id: 'logo',
    title: 'Logo Design',
    description: 'Learn professional logo creation and branding techniques.',
    category: 'design',
    image: 'images/Logo.jpg',
  },
  {
    id: 'android',
    title: 'Android Development',
    description: 'Learn to build Android apps using Java/Kotlin.',
    category: 'mobile',
    image: 'images/android.jpg',
  },
  {
    id: 'ios',
    title: 'iOS Development',
    description: 'Create iPhone apps using Swift and Apple tools.',
    category: 'mobile',
    image: 'images/ios.jpg',
  },
  {
    id: 'datascience',
    title: 'Data Science',
    description: 'Learn machine learning, data analysis, and AI using Python.',
    category: 'data',
    image: 'images/datascience.jpg',
  },
  {
    id: 'dataanalytics',
    title: 'Data Analytics',
    description: 'Analyze data using Excel, SQL, and visualization tools.',
    category: 'data',
    image: 'images/dataanalytics.jpg',
  },
];

const Course = () => {
  // Read search parameters from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Filter courses by title or description
  const filteredCourses = coursesList.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      <div className="course-page">
        {/* HERO SECTION */}
        <section className="hero">
          <div className="container">
            <h1 className="hero-title">Our Courses</h1>
            <p className="hero-subtitle">
              Upgrade Your Future with Our Expert IT Courses & Training Programs
            </p>
          </div>
        </section>

        {/* COURSES / SERVICES SECTION */}
        <section className="services">
          <div className="container">
            <div className="services-grid">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div key={course.id} className="service-card" data-category={course.category}>
                    <div className="card-image">
                      <img src={course.image} alt={course.title} />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{course.title}</h3>
                      <p className="card-description">{course.description}</p>
                      <Link to={`/course/${course.id}`} className="view-btn">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
                  <h3>No courses found matching "{searchQuery}"</h3>
                  <p>Try searching for another topic or technology.</p>
                  <button
                    onClick={() => setSearchParams({})}
                    className="view-btn"
                    style={{ marginTop: '15px', display: 'inline-block', border: 'none', cursor: 'pointer' }}
                  >
                    View All Courses
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* TEACHERS SECTION */}
        <section className="teachers-section">
          <div className="container">
            <h2 className="section-title">Meet Our Expert Teachers</h2>
            <p className="section-subtitle">Learn from experienced industry professionals</p>

            <div className="teachers-grid">
              <div className="teacher-card">
                <div className="teacher-img">
                  <img src="images/t1.jpg" alt="Rajesh Patel" />
                </div>
                <div className="teacher-info">
                  <h3>Rajesh Patel</h3>
                  <span className="subject">Web Development</span>
                  <p>10+ years of experience in Full Stack Web Technologies.</p>
                  <div className="social-links">
                    <a href="#linkedin"><i className="fa-brands fa-linkedin-in"></i></a>
                    <a href="#github"><i className="fa-brands fa-github"></i></a>
                    <a href="#facebook"><i className="fa-brands fa-facebook"></i></a>
                  </div>
                </div>
              </div>

              <div className="teacher-card">
                <div className="teacher-img">
                  <img src="images/t2.jpg" alt="Pooja Shah" />
                </div>
                <div className="teacher-info">
                  <h3>Pooja Shah</h3>
                  <span className="subject">UI/UX Design</span>
                  <p>Specialized in modern interface design & user research.</p>
                  <div className="social-links">
                    <a href="#linkedin"><i className="fa-brands fa-linkedin-in"></i></a>
                    <a href="#github"><i className="fa-brands fa-github"></i></a>
                    <a href="#facebook"><i className="fa-brands fa-facebook"></i></a>
                  </div>
                </div>
              </div>

              <div className="teacher-card">
                <div className="teacher-img">
                  <img src="images/t3.jpg" alt="Amit Sharma" />
                </div>
                <div className="teacher-info">
                  <h3>Amit Sharma</h3>
                  <span className="subject">Data Analytics</span>
                  <p>Data Scientist with expertise in Python & SQL.</p>
                  <div className="social-links">
                    <a href="#linkedin"><i className="fa-brands fa-linkedin-in"></i></a>
                    <a href="#github"><i className="fa-brands fa-github"></i></a>
                    <a href="#facebook"><i className="fa-brands fa-facebook"></i></a>
                  </div>
                </div>
              </div>

              <div className="teacher-card">
                <div className="teacher-img">
                  <img src="images/t4.jpg" alt="Neha Joshi" />
                </div>
                <div className="teacher-info">
                  <h3>Neha Joshi</h3>
                  <span className="subject">Python & Cyber Security</span>
                  <p>Certified Ethical Hacker & Lead Security Consultant.</p>
                  <div className="social-links">
                    <a href="#linkedin"><i className="fa-brands fa-linkedin-in"></i></a>
                    <a href="#github"><i className="fa-brands fa-github"></i></a>
                    <a href="#facebook"><i className="fa-brands fa-facebook"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="stats-section">
          <div className="container">
            <h2 className="stats-title">Our Achievements in Numbers</h2>

            <div className="stats-container">
              <div className="stat-box">
                <i className="fa-solid fa-user-graduate"></i>
                <h3>10,000+</h3>
                <p>Students Trained</p>
              </div>

              <div className="stat-box">
                <i className="fa-solid fa-laptop-code"></i>
                <h3>12+</h3>
                <p>Courses Available</p>
              </div>

              <div className="stat-box">
                <i className="fa-solid fa-briefcase"></i>
                <h3>98%</h3>
                <p>Placement Rate</p>
              </div>

              <div className="stat-box">
                <i className="fa-solid fa-award"></i>
                <h3>20+</h3>
                <p>Years Experience</p>
              </div>
            </div>

            <div className="badges">
              <span><i className="fa-solid fa-check-circle"></i> ISO Certified</span>
              <span><i className="fa-solid fa-star"></i> 4.9 Star Rating</span>
              <span><i className="fa-solid fa-shield-halved"></i> 100% Practical Training</span>
            </div>
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section className="reviews-section">
          <div className="container">
            <h2 className="review-title">What Our Students Say</h2>

            <div className="reviews-grid">
              <div className="review-card">
                <div className="stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p>"The Web Development course was awesome! Very practical and easy to understand."</p>
                <div className="user">
                  <img src="images/r1.jpg" alt="Rahul Sharma" />
                  <div>
                    <span className="name">Rahul Sharma</span>
                    <span className="role">Student</span>
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star-half-stroke"></i>
                </div>
                <p>"Best learning experience! The projects helped me build a great portfolio."</p>
                <div className="user">
                  <img src="images/r2.jpg" alt="Priya Patel" />
                  <div>
                    <span className="name">Priya Patel</span>
                    <span className="role">Student</span>
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-regular fa-star"></i>
                </div>
                <p>"Great content and well-structured modules. Highly recommended for beginners."</p>
                <div className="user">
                  <img src="images/r3.jpg" alt="Aman Mehta" />
                  <div>
                    <span className="name">Aman Mehta</span>
                    <span className="role">Student</span>
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p>"Clear explanations and hands-on practice. Loved the overall course layout!"</p>
                <div className="user">
                  <img src="images/r4.jpg" alt="Sneha Roy" />
                  <div>
                    <span className="name">Sneha Roy</span>
                    <span className="role">Student</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Course;