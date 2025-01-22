import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { API_Source } from '../global/Apisource';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

export const Login = () => {
  const navigate = useNavigate();
  const { saveAuthData } = useAuth();

  const mutation = useMutation({
    mutationFn: (credentials) => API_Source.login(credentials.username, credentials.password),
    onSuccess: (data) => {
      console.log('Login successful:', data);

      // Ambil token dan ID dari respons
      const token = data.token; // Pastikan ini sesuai dengan struktur respons API Anda
      const id = data.id; // Ambil ID pengguna dari respons

      // Simpan ID dan token ke context
      if (token && id) {
        saveAuthData(id, token);
      } else {
        console.error('Token or ID is undefined');
      }

      navigate('/kategori'); // Navigasi ke halaman kategori setelah login berhasil
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  const handleLogin = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    mutation.mutate({ username, password }); // Panggil mutasi untuk login
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(your-background-image-url)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white background
        }}
      >
        <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Welcome Back!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Please log in to your account
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            variant="outlined"
            sx={{ borderRadius: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, borderRadius: 2 }}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Logging in...' : 'Login'}
          </Button>
          {mutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Error: {mutation.error}
            </Alert>
          )}
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/user/signup">Sign Up</Link>
        </Typography>
      </Box>
    </Container>
  );
};
