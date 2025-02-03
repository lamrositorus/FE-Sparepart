import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { API_Source } from '../global/Apisource';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShowPassword from '../components/ShowPassword';

export const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Staff'); // Default role
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (newUser) =>
      API_Source.signup(newUser.username, newUser.password, newUser.email, newUser.role),
    onError: (error) => {
      console.error('Signup error:', error);
      toast.error('Signup failed: ' + error);
    },
    onSuccess: (data) => {
      console.log('Signup successful:', data);
      toast.success('Signup successful! Redirecting to login...');
      navigate('/user/login');
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    mutation.mutate({ username, password, email, role });
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <ToastContainer />
      <div className="w-full max-w-md p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Create an Account</h1>
        <p className="text-center mb-6">Please fill in the form to create an account</p>
        <form onSubmit={handleSignup}>
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
                className="grow input input-bordered"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="email"
                className="grow input input-bordered"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="mb-4">
            <ShowPassword
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <select
              className="select select-bordered w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <button
            type="submit"
            className={`btn btn-primary w-full ${mutation.isLoading ? 'loading' : ''}`}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Signing up...' : 'Sign Up'}
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
        <p className="text-center mt-4">
          Do you have an account? <Link to="/user/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
