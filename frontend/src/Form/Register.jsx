
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './AuthForm.css';

const API_URL =
  'https://awd-project-easytech.onrender.com/api/auth/register';

// Default Courses
const DEFAULT_COURSES = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'React JS',
  'Node JS',
  'PHP & MySQL',
  'Python Programming',
  'Java Programming',
  'UI/UX Design',
  'Graphic Design',
  'Logo Design',
  'Android Development',
  'iOS Development',
  'Data Science',
  'Data Analytics'
];

// Read available courses and exclude deleted courses
const getAvailableCourses = () => {
  try {
    const savedCourses = JSON.parse(
      localStorage.getItem('academyCourses') || '[]'
    );

    const deletedCourses = JSON.parse(
      localStorage.getItem('academyDeletedCourses') || '[]'
    );

    const customCourses = Array.isArray(savedCourses)
      ? savedCourses
          .map((course) =>
            String(course.courseName || course.title || '').trim()
          )
          .filter(Boolean)
      : [];

    const deletedCourseNames = Array.isArray(deletedCourses)
      ? deletedCourses.map((course) =>
          String(course).trim().toLowerCase()
        )
      : [];

    const allCourses = [
      ...new Set([...DEFAULT_COURSES, ...customCourses])
    ];

    return allCourses.filter(
      (course) =>
        !deletedCourseNames.includes(course.toLowerCase())
    );
  } catch (error) {
    console.error('Unable to load courses:', error);
    return DEFAULT_COURSES;
  }
};

const INITIAL_FORM = {
  full_name: '',
  email: '',
  phone: '',
  age: '',
  gender: '',
  course: '',
  time_slot: '',
  password: '',
  confirm_password: '',
  terms: false
};

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedCourse =
    location.state?.selectedCourse || '';

  const [courses, setCourses] = useState(getAvailableCourses);

  const [formData, setFormData] = useState({
    ...INITIAL_FORM,
    course: selectedCourse
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Refresh courses when page opens, gets focus, or storage changes
  useEffect(() => {
    const loadCourses = () => {
      const latestCourses = getAvailableCourses();

      setCourses(latestCourses);

      // Clear the selected course if it was deleted
      setFormData((prev) => {
        if (prev.course && !latestCourses.includes(prev.course)) {
          return {
            ...prev,
            course: ''
          };
        }

        return prev;
      });
    };

    loadCourses();

    window.addEventListener('focus', loadCourses);
    window.addEventListener('storage', loadCourses);

    // Support same-tab course changes made by the Dashboard
    window.addEventListener('academyCoursesUpdated', loadCourses);

    return () => {
      window.removeEventListener('focus', loadCourses);
      window.removeEventListener('storage', loadCourses);
      window.removeEventListener(
        'academyCoursesUpdated',
        loadCourses
      );
    };
  }, []);

  // Load Font Awesome icons
  useEffect(() => {
    const existingLink = document.querySelector(
      'link[data-register-fontawesome]'
    );

    if (existingLink) return;

    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href =
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';

    link.setAttribute('data-register-fontawesome', 'true');
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // Set course selected from another page only if it is available
  useEffect(() => {
    if (!selectedCourse) return;

    const latestCourses = getAvailableCourses();

    setCourses(latestCourses);

    setFormData((prev) => ({
      ...prev,
      course: latestCourses.includes(selectedCourse)
        ? selectedCourse
        : ''
    }));
  }, [selectedCourse]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    setErrorMessage('');
  };

  // Validate form
  const validateForm = (availableCourses) => {
    const name = formData.full_name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const ageText = String(formData.age).trim();
    const age = Number(ageText);
    const password = formData.password;

    const nameRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      return 'Please enter your full name.';
    }

    if (!nameRegex.test(name)) {
      return 'Name must contain English letters and spaces only. Numbers are not allowed.';
    }

    if (!email) {
      return 'Please enter your email address.';
    }

    if (email.length > 254 || !emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return 'Phone number must contain exactly 10 digits.';
    }

    if (
      ageText === '' ||
      !/^\d+$/.test(ageText) ||
      !Number.isInteger(age) ||
      age < 15 ||
      age > 40
    ) {
      return 'Age must be a whole number between 15 and 40.';
    }

    if (!['Male', 'Female'].includes(formData.gender)) {
      return 'Please select your gender.';
    }

    if (!availableCourses.includes(formData.course)) {
      return 'Please select a valid course.';
    }

    if (!['Morning', 'Evening'].includes(formData.time_slot)) {
      return 'Please select Morning or Evening time slot.';
    }

    if (password.length < 8 || password.length > 128) {
      return 'Password must contain between 8 and 128 characters.';
    }

    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }

    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }

    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'Password must contain at least one special character.';
    }

    if (!formData.confirm_password) {
      return 'Please confirm your password.';
    }

    if (password !== formData.confirm_password) {
      return 'Password and Confirm Password do not match.';
    }

    if (formData.terms !== true) {
      return 'Please accept the Terms & Conditions.';
    }

    return '';
  };

  // Submit registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (loading) return;

    // Always validate against the latest course list
    const latestCourses = getAvailableCourses();
    setCourses(latestCourses);

    const validationError = validateForm(latestCourses);

    if (validationError) {
      setErrorMessage(validationError);
      alert(validationError);
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to register?'
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          age: Number(formData.age),
          gender: formData.gender,
          course: formData.course,
          time_slot: formData.time_slot,
          password: formData.password,
          confirm_password: formData.confirm_password,
          terms: formData.terms
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      alert('Student Registration Successful!');

      setFormData({
        ...INITIAL_FORM,
        course: ''
      });

      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);

      const message =
        error.message || 'Unable to register. Please try again.';

      setErrorMessage(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-body">
      <div className="container">
        <div className="register-box">
          <h2>Student Registration</h2>
          <p>Fill in the details to register</p>

          {errorMessage && (
            <p className="error-message" role="alert">
              {errorMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              {/* Left Side */}
              <div className="form-column">
                <div className="input-box">
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    autoComplete="name"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="input-box">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                </div>

                <div className="input-box">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (10 digits)"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                  />
                </div>

                <div className="input-box">
                  <input
                    type="number"
                    name="age"
                    placeholder="Age (15-40)"
                    min="15"
                    max="40"
                    step="1"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="gender">
                  <label>Gender</label>

                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={handleChange}
                        required
                      />{' '}
                      Male
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={handleChange}
                        required
                      />{' '}
                      Female
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="form-column">
                <div className="input-box">
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Course</option>

                    {courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="time-slot">
                  <label>Select Time Slot</label>

                  <div className="time-options">
                    <label className="slot-card">
                      <input
                        type="radio"
                        name="time_slot"
                        value="Morning"
                        checked={formData.time_slot === 'Morning'}
                        onChange={handleChange}
                        required
                      />

                      <span>
                        Morning
                        <br />
                        9:00 AM - 1:00 PM
                      </span>
                    </label>

                    <label className="slot-card">
                      <input
                        type="radio"
                        name="time_slot"
                        value="Evening"
                        checked={formData.time_slot === 'Evening'}
                        onChange={handleChange}
                        required
                      />

                      <span>
                        Evening
                        <br />
                        2:00 PM - 6:00 PM
                      </span>
                    </label>
                  </div>
                </div>

                <div className="input-box password-box">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    maxLength={128}
                    required
                  />

                  <i
                    className={`fas ${
                      showPassword ? 'fa-eye-slash' : 'fa-eye'
                    } toggle-password`}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setShowPassword((prev) => !prev);
                      }
                    }}
                  />
                </div>

                <div className="input-box password-box">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    maxLength={128}
                    required
                  />

                  <i
                    className={`fas ${
                      showConfirmPassword
                        ? 'fa-eye-slash'
                        : 'fa-eye'
                    } toggle-password`}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setShowConfirmPassword((prev) => !prev);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="terms-box">
              <div className="terms-header">
                <i className="fas fa-file-contract" />
                <h3>Terms &amp; Conditions</h3>
              </div>

              <div className="terms-content">
                <ul>
                  <li>
                    Students must provide accurate personal
                    information during registration.
                  </li>
                  <li>
                    Select one batch:{' '}
                    <strong>Morning (9:00 AM - 1:00 PM)</strong> or{' '}
                    <strong>Evening (2:00 PM - 6:00 PM)</strong>.
                  </li>
                  <li>
                    Minimum attendance of <strong>80%</strong> is
                    required to receive certificates.
                  </li>
                  <li>
                    Course fees once paid are{' '}
                    <strong>non-refundable</strong> and
                    non-transferable.
                  </li>
                  <li>
                    You must accept the terms to register.
                  </li>
                </ul>
              </div>

              <label className="agree-box">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                />

                <span>
                  I have read and agree to the Terms &amp; Conditions.
                </span>
              </label>
            </div>

            <div className="button-box">
              <button
                type="submit"
                className="btn"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Now'}
              </button>
            </div>
          </form>

          <p className="footer-text">
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
