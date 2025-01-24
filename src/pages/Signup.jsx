import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { API_Source } from '../global/Apisource';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

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
    <Container
      component="main"
      maxWidth="xs"
      sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
          Create an Account
        </Typography>
        <Box component="form" onSubmit={handleSignup} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            variant="outlined"
            sx={{ borderRadius: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ marginTop: 2 }}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
              required
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, borderRadius: 2 }}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Signing up...' : 'Sign Up'}
          </Button>
          {mutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Error: {mutation.error}
            </Alert>
          )}
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Do you have an account? <Link to="/user/login">Sign Up</Link>
        </Typography>
      </Box>
    </Container>
  );
};
