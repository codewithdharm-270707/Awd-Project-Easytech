import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './CourseDetail.css';

// બધા કોર્સનો ડેટા
const coursesData = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Learn how to design and build beautiful, responsive, and user-friendly websites. This course focuses on modern UI design, layouts, and real-world frontend development skills.',
    duration: '3 Months',
    fees: '₹5,000',
    level: 'Beginner to Intermediate',
    syllabus: ['Introduction to Web Development', 'HTML5 Basics', 'CSS3 (Flexbox, Grid)', 'Responsive Design (Media Queries)', 'JavaScript Basics', 'DOM Manipulation', 'Bootstrap Framework', 'Website Deployment'],
    tools: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'GitHub'],
    projects: ['Personal Portfolio Website', 'Landing Page Design', 'Responsive Business Website', 'Interactive UI Project'],
    features: ['Real-world UI Projects', 'Responsive Design Practice', 'Modern Layout Techniques', 'Live Support & Guidance', 'Interview Preparation'],
    career: ['Frontend Developer', 'Web Designer', 'UI Developer', 'Freelancer']
  },
  {
    id: 'backend',
    title: 'Backend Development',
    description: 'Learn how to build powerful, secure, and scalable server-side applications. This course focuses on APIs, databases, and real-world backend systems used in modern web development.',
    duration: '3 Months',
    fees: '₹6,000',
    level: 'Intermediate',
    syllabus: ['Introduction to Backend & Server Architecture', 'HTTP Methods (GET, POST, PUT, DELETE)', 'Node.js & Express.js Basics', 'RESTful API Development', 'Authentication (JWT, Sessions)', 'Database (MySQL / MongoDB)', 'CRUD Operations', 'Error Handling & Middleware'],
    tools: ['Node.js', 'Express.js', 'MongoDB / MySQL', 'Postman (API Testing)', 'GitHub'],
    projects: ['REST API Project', 'User Authentication System', 'Blog Management System', 'Database-driven Web App'],
    features: ['Real-world Backend Projects', 'API Development Practice', 'Database Integration', 'Interview Preparation', 'Live Support & Guidance'],
    career: ['Backend Developer', 'API Developer', 'Full Stack Developer', 'Software Engineer']
  },
  {
    id: 'fullstack',
    title: 'Full Stack Development',
    description: 'Become a complete web developer by mastering both frontend and backend technologies. This course is designed to transform beginners into job-ready full stack developers with real-world project experience.',
    duration: '6 Months',
    fees: '₹10,000',
    level: 'Beginner to Advanced',
    syllabus: ['HTML5, CSS3, JavaScript (Core Frontend)', 'Advanced JavaScript & ES6+', 'React.js (Frontend Framework)', 'Node.js & Express.js (Backend)', 'RESTful API Development', 'Database (MongoDB & MySQL)', 'Authentication (JWT)', 'Git & GitHub Version Control', 'Deployment (Netlify, Vercel, Hosting)'],
    tools: ['VS Code', 'React.js', 'Node.js', 'MongoDB', 'Postman', 'GitHub'],
    projects: ['Portfolio Website (Frontend)', 'Blog Website (Full Stack)', 'E-commerce Website', 'Authentication System (Login/Register)', 'Admin Dashboard Panel'],
    features: ['Complete Frontend + Backend Training', 'Real-world Full Stack Projects', 'API Integration & Database Work', 'Interview Preparation & Mock Tests', 'Resume & Portfolio Building', 'Live Doubt Support'],
    career: ['Full Stack Developer', 'Web Developer', 'Software Engineer', 'Freelancer']
  },
  {
    id: 'react',
    title: 'React JS',
    description: "Learn the world's most popular JavaScript library to build fast, scalable, and dynamic single-page applications (SPAs). This course focuses on modern React concepts with real-world project development.",
    duration: '2 Months',
    fees: '₹5,000',
    level: 'Intermediate',
    syllabus: ['Introduction to React & Project Setup', 'JSX Syntax & Component-Based Architecture', 'Props & State Management', 'Event Handling in React', 'React Hooks (useState, useEffect, useContext)', 'Conditional Rendering & Lists', 'React Router (SPA Navigation)', 'API Integration (Fetch & Axios)'],
    tools: ['VS Code', 'React Developer Tools', 'Node.js & npm', 'Axios / Fetch API', 'GitHub'],
    projects: ['React Portfolio Website', 'Todo App with State Management', 'Weather App (API Integration)', 'Dynamic Dashboard UI'],
    features: ['Modern React (Hooks-based)', 'Project-based Learning', 'API Integration Practice', 'Reusable Components Design', 'Interview Preparation'],
    career: ['React Developer', 'Frontend Developer', 'UI Developer', 'Web Developer']
  },
  {
    id: 'node',
    title: 'Node JS',
    description: 'Learn how to build fast, scalable, and event-driven backend applications using Node.js. This course covers server-side development, APIs, and real-world backend projects using JavaScript.',
    duration: '2 Months',
    fees: '₹5,000',
    level: 'Intermediate',
    syllabus: ['Introduction to Node.js & Runtime Environment', 'Event Loop & Asynchronous Programming', 'Core Modules (File System, HTTP, Path)', 'NPM (Node Package Manager)', 'Express.js Framework', 'Routing & Middleware', 'REST API Development', 'MongoDB Integration (Mongoose)', 'Authentication (JWT)', 'Error Handling & Security'],
    tools: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Postman (API Testing)', 'GitHub'],
    projects: ['REST API Project', 'User Authentication System', 'Blog Backend API', 'CRUD Application'],
    features: ['Real-world Backend Development', 'API Building & Testing', 'Database Integration', 'Project-based Learning', 'Interview Preparation'],
    career: ['Node.js Developer', 'Backend Developer', 'API Developer', 'Full Stack Developer']
  },
  {
    id: 'php',
    title: 'PHP & MySQL',
    description: 'Learn how to build dynamic and database-driven websites using PHP and MySQL. This course covers backend logic, form handling, authentication, and real-world web application development.',
    duration: '2.5 Months',
    fees: '₹4,500',
    level: 'Beginner to Intermediate',
    syllabus: ['Introduction to PHP & Server Setup (XAMPP)', 'PHP Syntax, Variables, Loops & Functions', 'Forms Handling (GET/POST) & Validation', 'MySQL Database Design & Queries', 'CRUD Operations (Create, Read, Update, Delete)', 'PDO & MySQLi Database Connections', 'Session & Cookie Management', 'User Authentication (Login/Register System)', 'Security Best Practices (SQL Injection, XSS)'],
    tools: ['PHP', 'MySQL', 'XAMPP / Localhost Server', 'phpMyAdmin', 'VS Code', 'GitHub'],
    projects: ['User Login & Registration System', 'Dynamic Blog Website', 'Admin Panel Dashboard', 'Database-driven CRUD Application'],
    features: ['Complete Backend with Database', 'Real-world Projects', 'Form Handling & Authentication', 'Security Implementation', 'Interview Preparation'],
    career: ['PHP Developer', 'Backend Developer', 'Web Developer', 'Freelancer']
  },
  {
    id: 'python',
    title: 'Python Programming',
    description: 'Learn one of the most powerful and beginner-friendly programming languages used in web development, data science, automation, and AI. This course will take you from basics to advanced concepts with hands-on projects.',
    duration: '2.5 Months',
    fees: '₹4,500',
    level: 'Beginner to Intermediate',
    syllabus: ['Introduction to Python & Setup', 'Variables, Data Types & Operators', 'Control Statements (if, loops)', 'Functions & Modules', 'Object-Oriented Programming (OOP)', 'File Handling & Exception Handling', 'Working with Libraries (NumPy, Pandas - Basics)', 'Introduction to Automation Scripts'],
    tools: ['Python', 'VS Code / PyCharm', 'Jupyter Notebook', 'GitHub'],
    projects: ['Calculator App (CLI Based)', 'File Organizer Script', 'Mini Automation Project', 'Basic Data Analysis Project'],
    features: ['Beginner Friendly Learning', 'Hands-on Coding Practice', 'Real-world Examples', 'Project-based Training', 'Interview Preparation'],
    career: ['Python Developer', 'Data Analyst', 'Automation Engineer', 'Software Developer']
  },
  {
    id: 'java',
    title: 'Java Programming',
    description: 'Learn Java programming from basics to advanced and build strong object-oriented applications. This course is ideal for students who want to enter software development, Android development, or enterprise-level application development.',
    duration: '3 Months',
    fees: '₹5,000',
    level: 'Beginner to Intermediate',
    syllabus: ['Introduction to Java & Setup (JDK, IDE)', 'Java Syntax, Variables & Data Types', 'Operators & Control Statements (if, loops)', 'Object-Oriented Programming (OOP Concepts)', 'Classes, Objects & Constructors', 'Inheritance, Polymorphism, Abstraction & Encapsulation', 'Exception Handling & File Handling', 'Java Collections Framework (List, Set, Map)', 'Multithreading Basics', 'JDBC (Database Connectivity)'],
    tools: ['Java (JDK)', 'IntelliJ IDEA / Eclipse', 'MySQL', 'JDBC', 'GitHub'],
    projects: ['Student Management System', 'Banking System (Console Based)', 'Database Connectivity Project', 'Mini Java Application'],
    features: ['Strong OOP Concept Building', 'Hands-on Coding Practice', 'Real-world Examples', 'Project-based Learning', 'Interview Preparation'],
    career: ['Java Developer', 'Software Engineer', 'Backend Developer', 'Android Developer']
  },
  {
    id: 'uiux',
    title: 'UI/UX Design',
    description: 'Learn how to design user-friendly, modern, and visually appealing digital products. This course focuses on UI (User Interface) and UX (User Experience) principles using industry tools like Figma.',
    duration: '2 Months',
    fees: '₹4,500',
    level: 'Beginner to Intermediate',
    syllabus: ['Introduction to UI/UX & Design Thinking', 'User Research & Persona Creation', 'Information Architecture & Wireframing', 'Low-Fidelity & High-Fidelity Design', 'Color Theory, Typography & Layout Design', 'Figma Tool (Design, Components, Auto Layout)', 'Prototyping & Micro-interactions', 'Design Systems & UI Kits', 'Developer Handoff Process'],
    tools: ['Figma', 'Adobe XD (Basics)', 'Canva', 'Zeplin (Handoff)'],
    projects: ['Mobile App UI Design', 'Website UI Design', 'Dashboard UI Design', 'Prototype with User Flow'],
    features: ['Design Thinking Approach', 'Hands-on Practice in Figma', 'Real-world Design Projects', 'Portfolio Building Guidance', 'Interview Preparation'],
    career: ['UI Designer', 'UX Designer', 'Product Designer', 'Web Designer']
  },
  {
    id: 'graphic',
    title: 'Graphic Design',
    description: 'Unleash your creativity and master visual communication using industry-standard tools like Adobe Photoshop and Illustrator. This course helps you build a strong design foundation with real-world projects.',
    duration: '2 Months',
    fees: '₹4,000',
    level: 'Beginner',
    mode: 'Online + Offline',
    syllabus: ['Adobe Photoshop: Image Editing & Photo Manipulation', 'Adobe Illustrator: Vector Graphics & Illustrations', 'Social Media Banners & Print Design Layouts', 'Typography & Color Theory', 'Branding & Logo Design Basics', 'Portfolio Building with Creative Projects'],
    tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva (Basic)'],
    projects: ['Social Media Post Design', 'Logo Design Project', 'Poster & Banner Design', 'Brand Identity Kit'],
    features: ['Hands-on Design Practice', 'Creative Portfolio Development', 'Industry-Level Design Techniques', 'Guidance from Experts'],
    career: ['Graphic Designer', 'UI Designer', 'Social Media Designer', 'Freelancer']
  },
  {
    id: 'logo',
    title: 'Logo Design',
    description: 'Learn specialized brand identity creation, typography selection, and iconic logo vector drafting. This course focuses on building strong visual identities that communicate brand values effectively.',
    duration: '1.5 Months',
    fees: '₹3,500',
    level: 'Beginner',
    highlights: ['100% Practical Training with Real Projects', 'Learn Industry-Level Logo Design Techniques', 'Hands-on Practice with Adobe Illustrator', 'Creative Thinking & Idea Generation', 'Portfolio Development for Freelancing & Jobs'],
    syllabus: ['Brand Strategy & Psychology of Symbols', 'Sketching Ideas & Conceptualization', 'Vector Construction with Pen Tool & Geometry', 'Typography & Font Pairing Techniques', 'Color Systems for Digital & Print Media', 'Logo Variations (Minimal, Abstract, Mascot, Wordmark)', 'Responsive Logo Design (Multi-Platform Use)', 'Brand Guidelines Package Preparation'],
    tools: ['Adobe Illustrator', 'Adobe Photoshop (Basic Support)', 'Online Mockup Tools'],
    career: ['Logo Designer', 'Brand Identity Designer', 'Freelance Graphic Designer', 'Creative Agency Work']
  },
  {
    id: 'android',
    title: 'Android Development',
    description: 'Build native mobile apps for millions of Android devices worldwide using Kotlin or Java.',
    duration: '3 Months',
    fees: '₹6,000',
    level: 'Intermediate',
    batch: 'Morning / Evening',
    mode: 'Online + Offline',
    syllabus: ['Android Studio IDE Setup & Project Architecture', 'XML Layouts, Views & Material Design Components', 'Activities, Fragments & Intent Navigation', 'REST API Integration with Retrofit', 'Firebase Authentication & Realtime Database'],
    tools: ['Android Studio', 'Kotlin', 'Firebase'],
    projects: ['Simple Login App', 'API Based App'],
    career: ['Android Developer', 'App Developer']
  },
  {
    id: 'ios',
    title: 'iOS Development',
    description: 'Learn to build high-performance and visually appealing mobile applications for Apple devices like iPhone and iPad using modern technologies such as Swift and SwiftUI.',
    duration: '3 Months',
    fees: '₹7,000',
    level: 'Intermediate',
    highlights: ['Hands-on practical training with real-world app development', 'Live project development and debugging sessions', 'Guidance from experienced iOS developers', 'Certificate upon successful completion'],
    syllabus: ['Swift Programming Language (Basics to Advanced)', 'Xcode IDE Setup & Interface Understanding', 'UI Development using SwiftUI', 'Auto Layout & Responsive Design', 'API Integration & JSON Data Handling', 'Core Data & Local Storage', 'App Testing & Debugging Techniques', 'App Store Deployment & Guidelines'],
    tools: ['Swift', 'SwiftUI', 'Xcode', 'Firebase (Basics)'],
    career: ['iOS App Developer', 'Mobile Application Developer', 'Freelance App Developer']
  },
  {
    id: 'datascience',
    title: 'Data Science',
    description: 'Unlock insights from data using Python, Machine Learning, and visualization techniques. Become job-ready with hands-on datasets and projects.',
    duration: '4 Months',
    fees: '₹8,000',
    level: 'Advanced',
    details: { languages: 'Python', libraries: 'NumPy, Pandas, Scikit-learn', projectsCount: '6+ Real Datasets', careerSupport: 'Resume + Interview Prep' },
    syllabus: ['NumPy & Pandas for Data Analysis', 'Data Cleaning & Preprocessing', 'Data Visualization', 'Machine Learning Algorithms', 'Model Evaluation Techniques'],
    career: ['Data Scientist', 'Machine Learning Engineer', 'Data Analyst']
  },
  {
    id: 'dataanalytics',
    title: 'Data Analytics',
    description: 'Transform raw data into actionable business intelligence using SQL, Excel, and Power BI dashboards.',
    duration: '3 Months',
    fees: '₹6,000',
    level: 'All Levels',
    syllabus: ['Advanced Excel: Pivot Tables, Formulas & VLOOKUP/XLOOKUP', 'SQL for Data Extraction, Aggregation & Joins', 'Data Cleaning & Transformation Techniques', 'Building Interactive Dashboards in Power BI / Tableau', 'Business Storytelling with Data'],
    career: ['Data Analyst', 'Business Intelligence Analyst', 'Reporting Analyst']
  }
];

function CourseDetail() {
  const { id } = useParams();
  
  // URL માંથી ID મેચ કરો
  const course = coursesData.find((item) => item.id === id);

  // જો કોર્સ ન મળે તો Error Message બતાવો
  if (!course) {
    return (
      <div className="details-container" style={{ textAlign: 'center', padding: '80px' }}>
        <div className="not-found">
          <h2><i className="fa-solid fa-triangle-exclamation"></i> Course Not Found</h2>
          <p>Please return to the Course page and choose a valid course.</p>
          <Link to="/course" className="back-btn" style={{ display: 'inline-block', marginTop: '15px' }}>
            Go to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="details-container">
      <Link to="/course" className="back-btn">
        <i className="fa-solid fa-arrow-left"></i> Back to Course
      </Link>

      <section className="course-detail-section" style={{ display: 'block' }}>
        <div className="details-content">
          <h2>{course.title}</h2>
          <p className="description">{course.description}</p>

          <div className="info-badges">
            {course.duration && <span><i className="fa-solid fa-clock"></i> Duration: {course.duration}</span>}
            {course.fees && <span><i className="fa-solid fa-indian-rupee-sign"></i> Fees: {course.fees}</span>}
            {course.level && <span><i className="fa-solid fa-signal"></i> Level: {course.level}</span>}
          </div>

          {course.mode && <p><strong>Mode:</strong> {course.mode}</p>}
          {course.batch && <p><strong>Batch:</strong> {course.batch}</p>}

          {course.highlights && (
            <>
              <h3>Course Highlights:</h3>
              <ul>
                {course.highlights.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </>
          )}

          {course.syllabus && (
            <>
              <h3>Syllabus Overview:</h3>
              <ul>
                {course.syllabus.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </>
          )}

          {course.tools && (
            <>
              <h3>Tools & Technologies:</h3>
              <ul>
                {course.tools.map((tool, idx) => <li key={idx}>{tool}</li>)}
              </ul>
            </>
          )}

          {course.projects && (
            <>
              <h3>Live Projects:</h3>
              <ul>
                {course.projects.map((proj, idx) => <li key={idx}>{proj}</li>)}
              </ul>
            </>
          )}

          {course.features && (
            <>
              <h3>Course Features:</h3>
              <ul>
                {course.features.map((feat, idx) => <li key={idx}>{feat}</li>)}
              </ul>
            </>
          )}

          {course.career && (
            <>
              <h3>Career Opportunities:</h3>
              <ul>
                {course.career.map((car, idx) => <li key={idx}>{car}</li>)}
              </ul>
            </>
          )}

          <h3>Certification:</h3>
          <p>After completing the course, you will receive a professional certificate that will be helpful for jobs and freelancing.</p>

          <h3>Placement Support:</h3>
          <p>We provide job guidance, resume preparation, and mock interview support to help you build your career.</p>

            <Link to="/Register">
              <button className="submit-btn">Enroll Now</button>
            </Link>
        </div>
      </section>
    </div>
  );
}

export default CourseDetail;