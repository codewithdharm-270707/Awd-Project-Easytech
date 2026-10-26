
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCourse.css";

function AddCourse() {
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    courseName: "",
    description: "",
    category: "",
    image: "",
    duration: "",
    fees: "",
    level: "",
    syllabus: "",
    tools: "",
    projects: "",
    careerOpportunities: "",
    certification: "",
    placementSupport: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!course.courseName.trim() || !course.description.trim()) {
      alert("Please enter course name and description.");
      return;
    }

    const savedCourses = JSON.parse(
      localStorage.getItem("academyCourses") || "[]"
    );

    const newCourse = {
      ...course,
      id: `custom-${Date.now()}`,
      title: course.courseName.trim(),
      syllabus: course.syllabus
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      tools: course.tools
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      projects: course.projects
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      features: [],
      career: course.careerOpportunities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    localStorage.setItem(
      "academyCourses",
      JSON.stringify([...savedCourses, newCourse])
    );

    alert("Course added successfully!");

    navigate("/course");
  };

  return (
    <div className="add-course-page">
      <div className="add-course-container">
        <h2>Add New Course</h2>
        <p>Enter the details of the new course below.</p>

        <form onSubmit={handleSubmit}>
          <label>Course Name *</label>
          <input
            type="text"
            name="courseName"
            value={course.courseName}
            onChange={handleChange}
            placeholder="Enter course name"
            required
          />

          <label>Description *</label>
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            placeholder="Enter course description"
            required
          />

          <label>Category</label>
          <input
            type="text"
            name="category"
            value={course.category}
            onChange={handleChange}
            placeholder="e.g. Development, Design"
          />

          <label>Image URL</label>
          <input
            type="url"
            name="image"
            value={course.image}
            onChange={handleChange}
            placeholder="Paste image URL"
          />

          <label>Duration</label>
          <input
            type="text"
            name="duration"
            value={course.duration}
            onChange={handleChange}
            placeholder="e.g. 3 Months"
          />

          <label>Fees</label>
          <input
            type="text"
            name="fees"
            value={course.fees}
            onChange={handleChange}
            placeholder="e.g. ₹5000"
          />

          <label>Level</label>
          <select
            name="level"
            value={course.level}
            onChange={handleChange}
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <label>Syllabus (one topic per line)</label>
          <textarea
            name="syllabus"
            value={course.syllabus}
            onChange={handleChange}
            placeholder={"HTML Basics\nCSS Basics\nJavaScript"}
          />

          <label>Tools (separate with commas)</label>
          <input
            type="text"
            name="tools"
            value={course.tools}
            onChange={handleChange}
            placeholder="e.g. VS Code, Git, GitHub"
          />

          <label>Projects (one project per line)</label>
          <textarea
            name="projects"
            value={course.projects}
            onChange={handleChange}
            placeholder={"Portfolio Website\nStudent Management System"}
          />

          <label>Career Opportunities (separate with commas)</label>
          <input
            type="text"
            name="careerOpportunities"
            value={course.careerOpportunities}
            onChange={handleChange}
            placeholder="e.g. Developer, Freelancer"
          />

          <label>Certification</label>
          <input
            type="text"
            name="certification"
            value={course.certification}
            onChange={handleChange}
            placeholder="Certificate details"
          />

          <label>Placement Support</label>
          <textarea
            name="placementSupport"
            value={course.placementSupport}
            onChange={handleChange}
            placeholder="Enter placement support details"
          />

          <button type="submit">Add Course</button>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;
