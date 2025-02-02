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

  // Menangkap token dari URL setelah callback OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const id = params.get('id_user'); // Tangkap ID pengguna dari URL

    if (token) {
      // Simpan token ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('id_user', id); // Simpan ID pengguna ke localStorage

      // Simpan data autentikasi di konteks
      saveAuthData(id, token);
      navigate('/kategori'); // Arahkan ke halaman kategori
    }
  }, [navigate, saveAuthData]);

  const mutation = useMutation({
    mutationFn: (credentials) => API_Source.login(credentials.username, credentials.password),
    onSuccess: (data) => {
      const token = data.token; // Ambil token dari respons
      const id = data.id; // Ambil ID pengguna dari respons
      if (token && id) {
        // Simpan token ke localStorage
        localStorage.setItem('token', token);
        // Simpan data autentikasi di konteks
        saveAuthData(id, token);
        navigate('/kategori'); // Arahkan ke halaman kategori setelah login
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
    <div className="flex items-center justify-center min-h-screen ">
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-700 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Welcome Back!</h1>
        <p className="text-center mb-6">Please log in to your account</p>
        <form onSubmit={handleLogin}>
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
            <ShowPassword
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`btn btn-primary w-full ${mutation.isLoading ? 'loading' : ''}`}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Logging in...' : 'Login'}
          </button>
          {mutation.isError && (
            <div className="mt-4">
              <div className="alert alert-error">{mutation.error.message}</div>
            </div>
          )}
        </form>
        <div className="flex justify-center mt-4">
          <a
            href="http://localhost:4000/user/auth/google"
            className="btn btn-outline"
          >
            <img
              src="/icons8-google.svg"
              alt="Google Logo"
              className="w-5 h-5 mr-2"
            />
            Login with Google
          </a>
        </div>
        <p className="text-center mt-4">
          Don't have an account? <Link to="/user/signup" className="text-blue-500">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};