
import React from "react";
import { Link, useParams } from "react-router-dom";
import "./CourseDetail.css";

// Default Courses
const coursesData = [
  {
    id: "frontend",
    title: "Frontend Development",
    description:
      "Learn to create responsive and interactive websites using HTML, CSS and JavaScript.",
    duration: "3 Months",
    fees: "₹8,000",
    level: "Beginner",
    syllabus: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    tools: ["VS Code", "HTML", "CSS", "JavaScript", "Bootstrap"],
    projects: ["Personal Portfolio", "Responsive Website"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["Frontend Developer", "Web Designer"],
    certification: "Course Completion Certificate",
    placementSupport: "Resume Building and Interview Preparation",
  },
  {
    id: "backend",
    title: "Backend Development",
    description:
      "Learn server-side programming, APIs, databases and backend application development.",
    duration: "4 Months",
    fees: "₹10,000",
    level: "Intermediate",
    syllabus: ["Node.js", "Express.js", "REST APIs", "Database"],
    tools: ["Node.js", "Express.js", "MongoDB", "Postman"],
    projects: ["REST API", "User Authentication System"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["Backend Developer", "API Developer"],
    certification: "Course Completion Certificate",
    placementSupport: "Resume Building and Interview Preparation",
  },
  {
    id: "fullstack",
    title: "Full Stack Development",
    description:
      "Learn frontend and backend development to build complete web applications.",
    duration: "6 Months",
    fees: "₹15,000",
    level: "Intermediate",
    syllabus: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
    tools: ["React", "Node.js", "Express.js", "MongoDB", "Git"],
    projects: ["E-commerce Website", "Student Management System"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["Full Stack Developer", "Web Developer"],
    certification: "Course Completion Certificate",
    placementSupport: "Resume Building and Interview Preparation",
  },
  {
    id: "react",
    title: "React JS",
    description:
      "Learn to build modern user interfaces using React components, hooks and routing.",
    duration: "3 Months",
    fees: "₹8,000",
    level: "Intermediate",
    syllabus: ["Components", "Props", "State", "Hooks", "React Router"],
    tools: ["React", "Vite", "VS Code", "React Router"],
    projects: ["React Portfolio", "Dashboard Application"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["React Developer", "Frontend Developer"],
    certification: "Course Completion Certificate",
    placementSupport: "Resume Building and Interview Preparation",
  },
  {
    id: "node",
    title: "Node.js",
    description:
      "Learn server-side JavaScript and create APIs using Node.js and Express.",
    duration: "3 Months",
    fees: "₹8,000",
    level: "Intermediate",
    syllabus: ["Node.js Basics", "Modules", "Express.js", "REST APIs"],
    tools: ["Node.js", "Express.js", "Postman", "MongoDB"],
    projects: ["REST API", "Authentication System"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["Node.js Developer", "Backend Developer"],
    certification: "Course Completion Certificate",
    placementSupport: "Resume Building and Interview Preparation",
  },
  {
    id: "php",
    title: "PHP Development",
    description:
      "Learn PHP programming, database connectivity and dynamic website development.",
    duration: "3 Months",
    fees: "₹7,000",
    level: "Beginner",
    syllabus: ["PHP Basics", "Forms", "Sessions", "Database Connectivity"],
    tools: ["PHP", "MySQL", "XAMPP", "VS Code"],
    projects: ["Login System", "Student Management System"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["PHP Developer", "Web Developer"],
    certification: "Course Completion Certificate",
    placementSupport: "Resume Building and Interview Preparation",
  },
  {
    id: "python",
    title: "Python Programming",
    description:
      "Learn Python fundamentals, functions, object-oriented programming and projects.",
    duration: "3 Months",
    fees: "₹7,000",
    level: "Beginner",
    syllabus: ["Python Basics", "Loops", "Functions", "OOP", "File Handling"],
    tools: ["Python", "VS Code", "Jupyter Notebook"],
    projects: ["Calculator", "Student Record System"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["Python Developer", "Software Developer"],
    certification: "Course Completion Certificate",
    placementSupport: "Resume Building and Interview Preparation",
  },
  {
    id: "java",
    title: "Java Programming",
    description:
      "Learn Java programming, object-oriented concepts and application development.",
    duration: "4 Months",
    fees: "₹9,000",
    level: "Beginner",
    syllabus: ["Java Basics", "OOP", "Exception Handling", "Collections"],
    tools: ["Java", "Eclipse", "IntelliJ IDEA"],
    projects: ["Library Management System", "Banking Application"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["Java Developer", "Software Developer"],
    certification: "Course Completion Certificate",
    placementSupport: "Resume Building and Interview Preparation",
  },
  {
    id: "uiux",
    title: "UI/UX Design",
    description:
      "Learn user interface design, wireframing and user experience principles.",
    duration: "3 Months",
    fees: "₹8,000",
    level: "Beginner",
    syllabus: ["Design Principles", "Wireframing", "Prototyping", "UX Research"],
    tools: ["Figma", "Adobe XD"],
    projects: ["Mobile App Design", "Website Prototype"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["UI Designer", "UX Designer"],
    certification: "Course Completion Certificate",
    placementSupport: "Portfolio Building and Interview Preparation",
  },
  {
    id: "graphic",
    title: "Graphic Designing",
    description:
      "Learn graphic design fundamentals and create professional visual content.",
    duration: "3 Months",
    fees: "₹7,000",
    level: "Beginner",
    syllabus: ["Design Basics", "Typography", "Color Theory", "Branding"],
    tools: ["Photoshop", "Illustrator", "Canva"],
    projects: ["Poster Design", "Social Media Creatives"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["Graphic Designer", "Visual Designer"],
    certification: "Course Completion Certificate",
    placementSupport: "Portfolio Building and Interview Preparation",
  },
  {
    id: "logo",
    title: "Logo Designing",
    description:
      "Learn to create memorable logos and build brand identities.",
    duration: "2 Months",
    fees: "₹5,000",
    level: "Beginner",
    syllabus: ["Logo Concepts", "Typography", "Color Theory", "Brand Identity"],
    tools: ["Illustrator", "CorelDRAW", "Canva"],
    projects: ["Business Logo", "Brand Identity Kit"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["Logo Designer", "Brand Designer"],
    certification: "Course Completion Certificate",
    placementSupport: "Portfolio Building and Interview Preparation",
  },
  {
    id: "android",
    title: "Android Development",
    description:
      "Learn Android application development and create mobile applications.",
    duration: "4 Months",
    fees: "₹10,000",
    level: "Intermediate",
    syllabus: ["Android Basics", "Layouts", "Activities", "APIs"],
    tools: ["Android Studio", "Kotlin", "Firebase"],
    projects: ["To-Do App", "Student App"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["Android Developer", "Mobile App Developer"],
    certification: "Course Completion Certificate",
    placementSupport: "Resume Building and Interview Preparation",
  },
  {
    id: "ios",
    title: "iOS Development",
    description:
      "Learn the fundamentals of developing applications for Apple devices.",
    duration: "4 Months",
    fees: "₹12,000",
    level: "Intermediate",
    syllabus: ["Swift Basics", "UI Design", "App Navigation", "APIs"],
    tools: ["Swift", "Xcode"],
    projects: ["Notes App", "Mobile Application"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["iOS Developer", "Mobile App Developer"],
    certification: "Course Completion Certificate",
    placementSupport: "Resume Building and Interview Preparation",
  },
  {
    id: "datascience",
    title: "Data Science",
    description:
      "Learn data analysis, data visualization and introductory machine learning.",
    duration: "6 Months",
    fees: "₹15,000",
    level: "Advanced",
    syllabus: ["Python", "Statistics", "Data Analysis", "Machine Learning"],
    tools: ["Python", "Pandas", "NumPy", "Jupyter Notebook"],
    projects: ["Data Analysis Project", "Prediction Model"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["Data Scientist", "Data Analyst"],
    certification: "Course Completion Certificate",
    placementSupport: "Resume Building and Interview Preparation",
  },
  {
    id: "dataanalytics",
    title: "Data Analytics",
    description:
      "Learn how to analyze data and create reports and visual dashboards.",
    duration: "4 Months",
    fees: "₹10,000",
    level: "Intermediate",
    syllabus: ["Excel", "SQL", "Data Cleaning", "Data Visualization"],
    tools: ["Excel", "SQL", "Power BI", "Tableau"],
    projects: ["Sales Dashboard", "Business Data Report"],
    features: ["Practical Training", "Live Projects", "Certificate"],
    career: ["Data Analyst", "Business Analyst"],
    certification: "Course Completion Certificate",
    placementSupport: "Resume Building and Interview Preparation",
  },
];

// Convert array or text into an array
const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

// Read custom courses from localStorage
const getCustomCourses = () => {
  try {
    const savedCourses = JSON.parse(
      localStorage.getItem("academyCourses") || "[]"
    );

    if (!Array.isArray(savedCourses)) {
      return [];
    }

    return savedCourses.map((item) => ({
      ...item,

      id: String(item.id),

      title: item.title || item.courseName || "Untitled Course",

      description: item.description || "Course description is not available.",

      duration: item.duration || "Not specified",

      fees: item.fees || "Contact for fees",

      level: item.level || "Beginner",

      syllabus: toArray(item.syllabus),

      tools: toArray(item.tools),

      projects: toArray(item.projects),

      features: toArray(item.features),

      career: toArray(item.career || item.careerOpportunities),

      certification: item.certification || "Course completion certificate",

      placementSupport:
        item.placementSupport || "Contact us for placement support",
    }));
  } catch (error) {
    console.error("Unable to load custom courses:", error);
    return [];
  }
};

const CourseDetail = () => {
  const { id } = useParams();

  const customCourses = getCustomCourses();

  const allCourses = [...coursesData, ...customCourses];

  const course = allCourses.find(
    (item) => String(item.id) === decodeURIComponent(id || "")
  );

  if (!course) {
    return (
      <div className="details-container">
        <Link to="/course" className="back-btn">
          ← Back to Courses
        </Link>

        <div className="not-found">
          <h2>Course Not Found</h2>
          <p>The course you are looking for does not exist.</p>
          <Link to="/course" className="submit-btn">
            View All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="details-container">
      <Link to="/course" className="back-btn">
        ← Back to Courses
      </Link>

      <div className="course-detail-section">
        <div className="details-content">
          <h2>{course.title}</h2>

          <p className="description">{course.description}</p>

          <div className="info-badges">
            <span>Duration: {course.duration}</span>
            <span>Fees: {course.fees}</span>
            <span>Level: {course.level}</span>
          </div>

          <h3>Course Syllabus</h3>
          {course.syllabus.length > 0 ? (
            <ul>
              {course.syllabus.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Syllabus details will be updated soon.</p>
          )}

          <h3>Tools and Technologies</h3>
          {course.tools.length > 0 ? (
            <ul>
              {course.tools.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Tools and technologies will be updated soon.</p>
          )}

          <h3>Practical Projects</h3>
          {course.projects.length > 0 ? (
            <ul>
              {course.projects.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Project details will be updated soon.</p>
          )}

          {course.features.length > 0 && (
            <>
              <h3>Course Features</h3>
              <ul>
                {course.features.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          <h3>Career Opportunities</h3>
          {course.career.length > 0 ? (
            <ul>
              {course.career.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Career opportunities will be updated soon.</p>
          )}

          <h3>Certification</h3>
          <p>{course.certification}</p>

          <h3>Placement Support</h3>
          <p>{course.placementSupport}</p>

          <Link to="/register" className="submit-btn">
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
