import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForm.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://awd-project-easytech.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login Successful!');
        navigate('/dashboard?tab=account');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Server error, check if backend is running.');
    }
  };

  return (
    <div className="auth-body">
      <div className="container">
        <div className="register-box login-card">
          <h2>Login Account</h2>
          <p>Login With Easy Skill</p>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input-box password-box">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} autoComplete="new-password  " required />
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`} onClick={() => setShowPassword(!showPassword)}></i>
            </div>
            
            <div className="button-box">
              <button type="submit" className="btn">Login Now</button>
            </div>
          </form>
          <p className="footer-text">Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;