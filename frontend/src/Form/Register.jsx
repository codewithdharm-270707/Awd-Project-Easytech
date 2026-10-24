import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './AuthForm.css';

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get pre-selected course if passed from CourseDetail page
  const selectedCourseFromNav = location.state?.selectedCourse || '';

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    course: selectedCourseFromNav,
    time_slot: '',
    password: '',
    confirm_password: '',
    terms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Inject FontAwesome CDN for icons
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }, []);

  // Update course if user navigated from CourseDetail page
  useEffect(() => {
    if (selectedCourseFromNav) {
      setFormData((prev) => ({
        ...prev,
        course: selectedCourseFromNav
      }));
    }
  }, [selectedCourseFromNav]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Password Match Validation
    if (formData.password !== formData.confirm_password) {
      alert('Error: Password and Confirm Password do not match!');
      return;
    }

    const userConfirmed = window.confirm('Are you sure you want to register?');

    if (userConfirmed) {
      try {
        const response = await fetch('https://awd-project-easytech.onrender.com/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Thank you! Student Registration Successful.');
          
          // Clear form inputs
          setFormData({
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
          });

          navigate('/login');
        } else {
          setErrorMessage(data.message || 'Registration failed.');
          alert(data.message || 'Registration failed.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Server error, please make sure the backend server is running.');
      }
    }
  };

  return (
    <div className="auth-body">
      <div className="container">
        <div className="register-box">
          <h2>Student Registration</h2>
          <p>Fill in the details to register</p>

          <form onSubmit={handleSubmit}>
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
                    autoComplete="new-email"
                    required
                  />
                </div>

                <div className="input-box">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (10 digits)"
                    pattern="[0-9]{10}"
                    title="Enter a valid 10-digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-box">
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    min="1"
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
                    <option value="Frontend Development">Frontend Development</option>
                    <option value="Backend Development">Backend Development</option>
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="React JS">React JS</option>
                    <option value="Node JS">Node JS</option>
                    <option value="PHP & MySQL">PHP & MySQL</option>
                    <option value="Python Programming">Python Programming</option>
                    <option value="Java Programming">Java Programming</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Logo Design">Logo Design</option>
                    <option value="Android Development">Android Development</option>
                    <option value="iOS Development">iOS Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Data Analytics">Data Analytics</option>
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
                        {' '}
                        Morning<br />9:00 AM - 1:00 PM
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
                        {' '}
                        Evening<br />2:00 PM - 6:00 PM
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
                    required
                  />
                  <i
                    className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>

                <div className="input-box password-box">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                  />
                  <i
                    className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  ></i>
                </div>
              </div>
            </div>

            {/* Terms & Conditions Box */}
            <div className="terms-box">
              <div className="terms-header">
                <i className="fas fa-file-contract"></i>
                <h3>Terms & Conditions</h3>
              </div>

              <div className="terms-content">
                <ul>
                  <li>Students must provide accurate personal information during registration.</li>
                  <li>
                    Students must select only one batch: <strong>Morning (9:00 AM - 1:00 PM)</strong> or <strong>Evening (2:00 PM - 6:00 PM)</strong>.
                  </li>
                  <li>
                    Minimum attendance of <strong>80%</strong> is required to receive certificates.
                  </li>
                  <li>
                    Course fees once paid are <strong>non-refundable</strong> and non-transferable.
                  </li>
                  <li>By clicking the checkbox below, you agree to all terms.</li>
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
                <span>I have read and agree to the Terms & Conditions.</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="button-box">
              <button type="submit" className="btn">Register Now</button>
            </div>
          </form>

          <p className="footer-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;