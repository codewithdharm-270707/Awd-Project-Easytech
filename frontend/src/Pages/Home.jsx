import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  // 1. Ad Slider Logic State
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  // Next Slide Handlers
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Slider Auto-play Effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      handleNextSlide();
    }, 4000);

    return () => clearInterval(slideInterval);
  }, []);

  // 2. Typing Effect Logic State
  const [typedText, setTypedText] = useState("AI & ML");

  useEffect(() => {
    const words = [
      "AI & ML",
      "Web Development",
      "Digital Marketing",
      "Data Science",
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout;

    const type = () => {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        setTypedText(currentWord.substring(0, charIndex));
        charIndex--;
      } else {
        setTypedText(currentWord.substring(0, charIndex + 1));
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex > currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
        charIndex = currentWord.length;
      } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        charIndex = 0;
        typeSpeed = 500;
      }

      typingTimeout = setTimeout(type, typeSpeed);
    };

    typingTimeout = setTimeout(() => {
      charIndex = "AI & ML".length;
      isDeleting = true;
      type();
    }, 2000);

    return () => clearTimeout(typingTimeout);
  }, []);
  return (
    <div className="home-container">
      {/* AD SLIDER SECTION */}
      <section className="ad-slider-section" id="home">
        <div className="ad-container">
          <div
            className="ad-wrapper"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <div className="ad-slide slide-1">
              <div className="ad-content">
                <h1>
                  Master <span>AI & ML</span>
                </h1>
                <p>Join the future of technology today.</p>
                <Link to="/course" className="btn-cta">
                  Enroll Now <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
              <div className="ad-image">
                <img src="images/a1.jpg" alt="AI & ML" />
              </div>
            </div>

            <div className="ad-slide slide-2">
              <div className="ad-content">
                <h1>
                  Web <span>Development</span>
                </h1>
                <p>Build stunning modern websites.</p>
                <Link to="/course" className="btn-cta">
                  Enroll Now <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
              <div className="ad-image">
                <img src="images/a2.jpg" alt="Web Development" />
              </div>
            </div>

            <div className="ad-slide slide-3">
              <div className="ad-content">
                <h1>
                  Digital <span>Marketing</span>
                </h1>
                <p>Grow your brand globally.</p>
                <Link to="/course" className="btn-cta">
                  Enroll Now <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
              <div className="ad-image">
                <img src="images/a3.jpg" alt="Digital Marketing" />
              </div>
            </div>
          </div>

          <button
            className="ad-prev"
            onClick={handlePrevSlide}
            aria-label="Previous Slide"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            className="ad-next"
            onClick={handleNextSlide}
            aria-label="Next Slide"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          {/* Dots Navigation */}
          <div className="ad-dots">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className={`dot ${currentSlide === index ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>
      {/* ABOUT SECTION */}
      <section className="about-section">
        <div className="about-content">
          <h1 className="about-title">
            Elevate Your Career <br />
            with <span className="typed-text">{typedText}</span>
            <span className="cursor"></span>
          </h1>

          <p className="about-subtitle">
            Expert-led courses in AI, Development, and Marketing to help you
            succeed in the digital age.
          </p>

          <div className="about-buttons">
            <Link to="/course" className="btn btn-start">
              Get Started
            </Link>
            <Link to="/projects" className="btn btn-view">
              View Projects
            </Link>
          </div>
        </div>

        <div className="about-graphic">
          <div className="computer-icon-card">
            <i className="fa-solid fa-laptop-code"></i>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stat-item">
            <h2>
              <i className="fa-solid fa-users"></i> 10k+
            </h2>
            <p>Students</p>
          </div>
          <div className="stat-item">
            <h2>
              <i className="fa-solid fa-book"></i> 12+
            </h2>
            <p>Courses</p>
          </div>
          <div className="stat-item">
            <h2>
              <i className="fa-solid fa-diagram-project"></i> 300+
            </h2>
            <p>Projects</p>
          </div>
          <div className="stat-item">
            <h2>
              <i className="fa-solid fa-briefcase"></i> 98%
            </h2>
            <p>Placement</p>
          </div>
        </div>
      </section>

      {/* CAREER / EXPERTS SECTION */}
      <section className="career-section">
        <div className="container">
          <div className="section-title">
            <h2>Learn From Industry Experts</h2>
            <p>
              Master today's most in-demand skills with expert mentors from
              leading technology companies.
            </p>
          </div>

          <div className="career-grid">
            <div className="career-card">
              <img src="images/p1.jpg" alt="Anjali Shah" />
              <div className="career-content">
                <span className="tag">Data Science</span>
                <h3>Anjali Shah</h3>
                <h4>Senior Data Scientist</h4>
                <p>
                  10+ years of experience in AI, Machine Learning, Python, Deep
                  Learning, and Big Data Analytics.
                </p>
                <div className="career-info">
                  <span>
                    <i className="fa-solid fa-briefcase"></i> Google
                  </span>
                  <span>
                    <i className="fa-solid fa-user-graduate"></i> 18K+ Students
                  </span>
                </div>
              </div>
            </div>

            <div className="career-card">
              <img src="images/p2.jpg" alt="Karan Verma" />
              <div className="career-content">
                <span className="tag">Web Development</span>
                <h3>Karan Verma</h3>
                <h4>Full Stack Developer</h4>
                <p>
                  Expert in HTML, CSS, JavaScript, React, Node.js, MongoDB, and
                  Cloud Deployment.
                </p>
                <div className="career-info">
                  <span>
                    <i className="fa-solid fa-building"></i> Oracle
                  </span>
                  <span>
                    <i className="fa-solid fa-user-graduate"></i> 15K+ Students
                  </span>
                </div>
              </div>
            </div>

            <div className="career-card">
              <img src="images/p3.jpg" alt="Rohit Kumar" />
              <div className="career-content">
                <span className="tag">Cyber Security</span>
                <h3>Hetvi Patel</h3>
                <h4>Security Consultant</h4>
                <p>
                  Certified Ethical Hacker with expertise in Network Security
                  and Penetration Testing.
                </p>
                <div className="career-info">
                  <span>
                    <i className="fa-solid fa-shield-halved"></i> IBM
                  </span>
                  <span>
                    <i className="fa-solid fa-user-graduate"></i> 12K+ Students
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES SECTION */}
      <section className="courses-section" id="courses">
        <div className="container">
          <div className="section-header">
            <h2>Popular Courses</h2>
            <p>Hover on any course card to explore details</p>
          </div>

          <div className="course-grid">
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="icon-box">
                    <i className="fa-solid fa-code"></i>
                  </div>
                  <h3>Full Stack Web Dev</h3>
                </div>
                <div className="flip-card-back">
                  <h3>Full Stack Web Dev</h3>
                  <p>
                    Master HTML, CSS, JS, React & Node.js to build modern web
                    apps from scratch.
                  </p>
                </div>
              </div>
            </div>

            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="icon-box">
                    <i className="fa-solid fa-chart-pie"></i>
                  </div>
                  <h3>Data Analytics</h3>
                </div>
                <div className="flip-card-back">
                  <h3>Data Analytics</h3>
                  <p>
                    Learn Python, SQL, Excel, and Power BI for data
                    visualization and insight generation.
                  </p>
                </div>
              </div>
            </div>

            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="icon-box">
                    <i className="fa-solid fa-pen-nib"></i>
                  </div>
                  <h3>UI/UX & Graphic Design</h3>
                </div>
                <div className="flip-card-back">
                  <h3>UI/UX & Graphic Design</h3>
                  <p>
                    Create stunning interfaces and prototypes using Figma,
                    Photoshop & Illustrator.
                  </p>
                </div>
              </div>
            </div>

            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="icon-box">
                    <i className="fa-solid fa-bullhorn"></i>
                  </div>
                  <h3>Digital Marketing</h3>
                </div>
                <div className="flip-card-back">
                  <h3>Digital Marketing</h3>
                  <p>
                    Master SEO, Google Ads, Meta Ads & Social Media marketing
                    strategies.
                  </p>
                </div>
              </div>
            </div>

            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="icon-box">
                    <i className="fa-solid fa-mobile-screen-button"></i>
                  </div>
                  <h3>App Development</h3>
                </div>
                <div className="flip-card-back">
                  <h3>App Development</h3>
                  <p>
                    Build cross-platform mobile apps for Android & iOS using
                    Flutter or React Native.
                  </p>
                </div>
              </div>
            </div>

            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="icon-box">
                    <i className="fa-brands fa-python"></i>
                  </div>
                  <h3>Python Mastery</h3>
                </div>
                <div className="flip-card-back">
                  <h3>Python Mastery</h3>
                  <p>
                    Learn core Python concepts, automation scripts, and
                    Django/Flask frameworks.
                  </p>
                </div>
              </div>
            </div>

            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="icon-box">
                    <i className="fa-solid fa-brain"></i>
                  </div>
                  <h3>AI & Machine Learning</h3>
                </div>
                <div className="flip-card-back">
                  <h3>AI & Machine Learning</h3>
                  <p>
                    Explore predictive models, neural networks, NLP, and AI
                    algorithm building.
                  </p>
                </div>
              </div>
            </div>

            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="icon-box">
                    <i className="fa-solid fa-shield-alt"></i>
                  </div>
                  <h3>Cyber Security</h3>
                </div>
                <div className="flip-card-back">
                  <h3>Cyber Security</h3>
                  <p>
                    Understand ethical hacking, network security, threat
                    analysis, and protection protocols.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS & TESTIMONIALS SECTION */}
      <section className="reviews">
        <div className="reviews-container">
          <div className="section-heading">
            <span className="trust-badge">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              Trusted by 10,000+ Students
            </span>
            <h2>Why Students Love EasyTech Academy</h2>
            <p>
              Learn from industry experts and build real-world skills with our
              professional IT courses.
            </p>
          </div>

          <div className="rating-box">
            <div className="rating-card">
              <h1>4.9</h1>
              <div className="stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star-half-stroke"></i>
              </div>
              <p>Average Student Rating</p>
            </div>

            <div className="stats">
              <div className="stat">
                <h3>10k+</h3>
                <span>Students</span>
              </div>
              <div className="stat">
                <h3>50+</h3>
                <span>Expert Trainers</span>
              </div>
              <div className="stat">
                <h3>12+</h3>
                <span>Professional Courses</span>
              </div>
              <div className="stat">
                <h3>98%</h3>
                <span>Placement Support</span>
              </div>
            </div>
          </div>

          <div className="review-grid">
            <div className="review-card">
              <img src="images/11.jpg" alt="Niraj Sharma" />
              <h3>Niraj Sharma</h3>
              <span className="course-tag">AI & Machine Learning</span>
              <div className="review-stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p>
                "Amazing mentors and practical projects. I landed my first AI
                internship after completing the course."
              </p>
            </div>

            <div className="review-card">
              <img src="images/12.jpg" alt="James Anderson" />
              <h3>James Anderson</h3>
              <span className="course-tag">Data Science</span>
              <div className="review-stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p>
                "The Data Science roadmap was clear and easy to follow. Highly
                recommended for beginners."
              </p>
            </div>

            <div className="review-card">
              <img src="images/13.jpg" alt="Michael Brown" />
              <h3>Michael Brown</h3>
              <span className="course-tag">Digital Marketing</span>
              <div className="review-stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p>
                "Professional trainers with live projects. Best investment I
                have made for my IT career."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATE SECTION */}
      <section className="cert-section">
        <h1 className="std-Certification">Official Student Certification</h1>
        <div className="cert-box">
          <div className="cert-info-card">
            <div className="cert-icon">
              <i className="fa-solid fa-award"></i>
            </div>
            <h3>Earn Industry Recognized Certificate</h3>
            <p>
              Upon completing your course, you will receive a verified
              certificate containing your unique registration ID, grade, and
              project details.
            </p>

            <Link to="/certificate" className="btn btn-gold">
              <i className="fa-solid fa-eye"></i> View Certificate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
