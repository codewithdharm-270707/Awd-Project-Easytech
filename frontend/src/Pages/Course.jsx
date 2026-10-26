import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Course.css';

const defaultCourses = [
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
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [courses, setCourses] = useState(defaultCourses);

  useEffect(() => {
    const loadCourses = () => {
      try {
        const savedCourses = JSON.parse(
          localStorage.getItem('academyCourses') || '[]'
        );

        const formattedCourses = savedCourses.map(course => ({
          id: String(course.id),
          title: course.courseName || course.title || 'Untitled Course',
          description:
            course.description || 'Explore this course at EasyTech.',
          category: (course.category || 'other')
            .toLowerCase()
            .replace(/\s+/g, ''),
          image: course.image || 'images/frontend.jpg',
          duration: course.duration || '',
          fees: course.fees || '',
          level: course.level || 'Beginner to Intermediate',
          syllabus: course.syllabus || [],
          tools: course.tools || [],
          projects: course.projects || [],
          features: course.features || [],
          careerOpportunities: course.careerOpportunities || [],
          certification: course.certification || '',
          placementSupport: course.placementSupport || '',
        }));

        const defaultIds = new Set(defaultCourses.map(course => course.id));

        const additionalCourses = formattedCourses.filter(
          course => !defaultIds.has(course.id)
        );

        setCourses([...defaultCourses, ...additionalCourses]);
      } catch (error) {
        console.error('Unable to load saved courses:', error);
        setCourses(defaultCourses);
      }
    };

    loadCourses();

    window.addEventListener('storage', loadCourses);

    return () => {
      window.removeEventListener('storage', loadCourses);
    };
  }, []);

  const filteredCourses = courses.filter(course => {
    const query = searchQuery.toLowerCase();

    return (
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query)
    );
  });

  return (
    <main>
      <div className="course-page">

        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h1 className="hero-title">Our Courses</h1>
            <p className="hero-subtitle">
              Upgrade Your Future with Our Expert IT Courses & Training Programs
            </p>
          </div>
        </section>

        {/* Courses Section */}
        <section className="services">
          <div className="container">
            <div className="services-grid">
              {filteredCourses.length > 0 ? (
                filteredCourses.map(course => (
                  <div
                    key={course.id}
                    className="service-card"
                    data-category={course.category}
                  >
                    <div className="card-image">
                      <img
                        src={course.image}
                        alt={course.title}
                        onError={e => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'images/frontend.jpg';
                        }}
                      />
                    </div>

                    <div className="card-content">
                      <h3 className="card-title">{course.title}</h3>

                      <p className="card-description">
                        {course.description}
                      </p>

                      <Link
                        to={`/course/${encodeURIComponent(course.id)}`}
                        className="view-btn"
                      >
                        View Details
                      </Link>
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
                  <h3>No courses found matching "{searchQuery}"</h3>
                  <p>Try searching for another topic or technology.</p>

                  <button
                    onClick={() => setSearchParams({})}
                    className="view-btn"
                    style={{
                      marginTop: '15px',
                      display: 'inline-block',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    View All Courses
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Teachers Section */}
        <section className="teachers-section">
          <div className="container">
            <h2 className="section-title">Meet Our Expert Teachers</h2>
            <p className="section-subtitle">
              Learn from experienced industry professionals
            </p>

            <div className="teachers-grid">
              {[
                {
                  name: 'Rajesh Patel',
                  subject: 'Web Development',
                  description:
                    '10+ years of experience in Full Stack Web Technologies.',
                  image: 'images/t1.jpg',
                },
                {
                  name: 'Pooja Shah',
                  subject: 'UI/UX Design',
                  description:
                    'Specialized in modern interface design & user research.',
                  image: 'images/t2.jpg',
                },
                {
                  name: 'Amit Sharma',
                  subject: 'Data Analytics',
                  description:
                    'Data Scientist with expertise in Python & SQL.',
                  image: 'images/t3.jpg',
                },
                {
                  name: 'Neha Joshi',
                  subject: 'Python & Cyber Security',
                  description:
                    'Certified Ethical Hacker & Lead Security Consultant.',
                  image: 'images/t4.jpg',
                },
              ].map(teacher => (
                <div className="teacher-card" key={teacher.name}>
                  <div className="teacher-img">
                    <img src={teacher.image} alt={teacher.name} />
                  </div>

                  <div className="teacher-info">
                    <h3>{teacher.name}</h3>
                    <span className="subject">{teacher.subject}</span>
                    <p>{teacher.description}</p>

                    <div className="social-links">
                      <a href="#linkedin" aria-label="LinkedIn">
                        <i className="fa-brands fa-linkedin-in"></i>
                      </a>
                      <a href="#github" aria-label="GitHub">
                        <i className="fa-brands fa-github"></i>
                      </a>
                      <a href="#facebook" aria-label="Facebook">
                        <i className="fa-brands fa-facebook"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
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
                <h3>{courses.length}+</h3>
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
              <span>
                <i className="fa-solid fa-check-circle"></i> ISO Certified
              </span>
              <span>
                <i className="fa-solid fa-star"></i> 4.9 Star Rating
              </span>
              <span>
                <i className="fa-solid fa-shield-halved"></i> 100% Practical Training
              </span>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="reviews-section">
          <div className="container">
            <h2 className="review-title">What Our Students Say</h2>

            <div className="reviews-grid">
              {[
                {
                  name: 'Rahul Sharma',
                  image: 'images/r1.jpg',
                  review:
                    'The Web Development course was awesome! Very practical and easy to understand.',
                  stars: 5,
                },
                {
                  name: 'Priya Patel',
                  image: 'images/r2.jpg',
                  review:
                    'Best learning experience! The projects helped me build a great portfolio.',
                  stars: 4,
                },
                {
                  name: 'Aman Mehta',
                  image: 'images/r3.jpg',
                  review:
                    'Great content and well-structured modules. Highly recommended for beginners.',
                  stars: 4,
                },
                {
                  name: 'Sneha Roy',
                  image: 'images/r4.jpg',
                  review:
                    'Clear explanations and hands-on practice. Loved the overall course layout!',
                  stars: 5,
                },
              ].map(student => (
                <div className="review-card" key={student.name}>
                  <div className="stars">
                    {Array.from({ length: student.stars }).map((_, index) => (
                      <i key={index} className="fa-solid fa-star"></i>
                    ))}
                  </div>

                  <p>"{student.review}"</p>

                  <div className="user">
                    <img src={student.image} alt={student.name} />
                    <div>
                      <span className="name">{student.name}</span>
                      <span className="role">Student</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Course;