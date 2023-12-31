import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/logincontext';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import BASE_URL from '../config';
import { UserNameContext } from '../context/namecontext';

export default function SignUp(props) {
  const { setIsLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [samePassword, setSamePassword] = useState(true);
  const { updateUserName } = useContext(UserNameContext);

  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/signup`,
        {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        },
        { withCredentials: true } // Include this in the request config
      );

      console.log(response);

      if (response.status === 200 && response.status < 300) {
        const json = response.data;

        if (json.success) {
          props.showAlert('Signup Success', 'success');
          setIsLoggedIn(true);
          updateUserName(json.user.name);
          navigate('/');
        }
      } else {
        props.showAlert('Something error occurred', 'danger');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        const json = error.response.data;
        console.log(json);
        props.showAlert(json.error, 'danger');
      } else {
        props.showAlert('Invalid Credentials', 'danger');
      }
      navigate('/signup');
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'password') {
      if (
        value.length !== 0 &&
        confirmPassword.length !== 0 &&
        value !== confirmPassword
      ) {
        setSamePassword(false);
      } else if (
        value.length !== 0 &&
        confirmPassword.length !== 0 &&
        value === confirmPassword
      ) {
        setSamePassword(true);
      }
    }
    setCredentials((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function handleConfirmPasswordChange(e) {
    setConfirmPassword(e.target.value);
    if (e.target.value === '' || credentials.password === '') {
      setSamePassword(true);
      return;
    }
    if (e.target.value === credentials.password) {
      setSamePassword(true);
    } else {
      setSamePassword(false);
    }
  }
  async function handleOauthLogin(e) {
    e.preventDefault();
    window.open(`${BASE_URL}/auth/google`, '_self');
  }
  async function handleFOauthLogin(e) {
    e.preventDefault();
    window.open(`${BASE_URL}/auth/facebook`, '_self');
  }
  async function handleGiOauthLogin(e) {
    e.preventDefault();
    window.open(`${BASE_URL}/auth/github`, '_self');
  }

  return (
    <>
      <h1 className="auth-header">Sign Up</h1>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div className="row mb-6">
            <div className="col col-md-4">
              <input
                type="text"
                className="form-control auth-input"
                name="name"
                placeholder="Name"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mb-6">
            <div className="col col-md-4">
              <input
                type="email"
                className="form-control auth-input"
                name="email"
                placeholder="Email"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mb-6">
            <div className="col col-md-4">
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control auth-input"
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                />
                <button
                  className="btn btn-light password-button"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          <div className="row mb-6">
            <div className="col col-md-4">
              <input
                type="password"
                className="form-control auth-input"
                name="confirm_password"
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm Password"
              />
            </div>
          </div>
          {samePassword ? null : (
            <p className="error">Passwords do not match</p>
          )}

          <div className="row mb-6">
            <div className="col col-md-4">
              <button
                className="btn btn-primary login-button btn-submit"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
        <div className="row mb-6">
          <div className="col col-md-4">
            <button
              onClick={handleOauthLogin}
              className="btn btn-primary login-button btn-submit"
              type="submit"
            >
              <i className="fa-brands fa-google"></i>Sign Up With Google
            </button>
          </div>
        </div>
        <div className="row mb-6">
          <div className="col col-md-4">
            <button
              onClick={handleFOauthLogin}
              className="btn btn-primary login-button btn-submit"
              type="submit"
            >
              <i className="fa-brands fa-facebook"></i>Sign Up With Facebook
            </button>
          </div>
        </div>
        <div className="row mb-6">
          <div className="col col-md-4">
            <button
              onClick={handleGiOauthLogin}
              className="btn btn-primary login-button btn-submit"
              type="submit"
            >
              <i className="fa-brands fa-github"></i>Sign Up With Github
            </button>
          </div>
        </div>
      </div>
      <p className="existing">
        Already have an account?{' '}
        <Link className="link" to="/login">
          Sign in now
        </Link>
      </p>
    </>
  );
}
