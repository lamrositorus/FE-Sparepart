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
      console.error('Signup error:', error.message);
      console.log('input', username, password, email, role);
    },
    onSuccess: (data) => {
      console.log('Signup successful:', data);
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
      <div className="w-full max-w-md p-6  rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Create an Account</h1>
        <p className="text-center mb-6">Please fill in the form to create an account</p>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
              <div className="alert alert-error">{mutation.error.message}</div>
            </div>
          )}
        </form>
        <p className="text-center mt-4">
          Do you have an account? <Link to="/user/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};