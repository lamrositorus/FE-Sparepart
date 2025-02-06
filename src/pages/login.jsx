import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { API_Source } from '../global/Apisource';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShowPassword from '../components/ShowPassword';

export const Login = () => {
  const navigate = useNavigate();
  const { saveAuthData } = useAuth();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // Capture token from URL after OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const id = params.get('id_user'); // Capture user ID from URL

    if (token) {
      // Save token to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('id_user', id); // Save user ID to localStorage

      // Save authentication data in context
      saveAuthData(id, token);
      navigate('/dashboard'); // Redirect to categories page
    }
  }, [navigate, saveAuthData]);

  const mutation = useMutation({
    mutationFn: (credentials) => API_Source.login(credentials.username, credentials.password),
    onSuccess: (data) => {
      const token = data.token; // Get token from response
      const id = data.id; // Get user ID from response
      if (token && id) {
        // Save token to localStorage
        localStorage.setItem('token', token);
        // Save authentication data in context
        saveAuthData(id, token);
        navigate('/kategori'); // Redirect to categories page after login
      } else {
        console.error('Token or ID is undefined');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  const handleLogin = (event) => {
    event.preventDefault();
    mutation.mutate({ username, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="w-full max-w-md p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Welcome Back!</h1>
        <p className="text-center mb-6">Please log in to your account</p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                type="text"
                placeholder="Username"
                className="grow"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <ShowPassword
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`btn btn-primary w-full ${mutation.isLoading ? 'loading' : ''}`}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Logging in...' : 'Login'}
          </button>
          {mutation.isError && (
            <div className="mt-4">
              <div role="alert" className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{mutation.error}</span>
              </div>
            </div>
          )}
        </form>
        <div className="flex justify-center mt-4">
          <a href="http://localhost:4000/user/auth/google" className="btn btn-outline">
            <img src="/icons8-google.svg" alt="Google Logo" className="w-5 h-5 mr-2" />
            Login with Google
          </a>
        </div>
        <p className="text-center mt-4">
          Don't have an account? <Link to="/user/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};
