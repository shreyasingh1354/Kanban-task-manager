import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService'; // API function to register user
import {
  Container, TextField, Button, Box, Typography, Paper, IconButton,
  InputAdornment, Divider, Alert
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Import the SVG illustration (same as Login Page for consistency)
import Illustration from '../assets/loginilus.svg';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', phone_no: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await register(formData);
      alert('Registration successful! Please login.');
      console.log("Registration Response:", response);
      navigate('/'); // Redirect to login page
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={6} sx={{ display: 'flex', width: '100%', maxWidth: 900, borderRadius: 3, overflow: 'hidden' }}>
        
        {/* Left Section - Register Form */}
        <Box sx={{ flex: 1, padding: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>Create an Account</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>Fill in the details to create a new account:</Typography>

          <Divider sx={{ my: 2 }}>Register with Email</Divider>

          {/* Show error message if registration fails */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Username"
              type="text"
              variant="outlined"
              fullWidth
              required
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Phone Number"
              type="text"
              variant="outlined"
              fullWidth
              required
              onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>Register</Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account? <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate('/')}>Log in</span>
            </Typography>
          </Box>
        </Box>

        {/* Right Section - Illustration */}
        <Box sx={{ 
          flex: 1, 
          
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'white', 
          padding: 4 
        }}>
          <img src={Illustration} alt="Illustration" style={{ width: '80%', height: 'auto', filter: 'brightness(1.2)' }} />
        </Box>
        
      </Paper>
    </Container>
  );
};

export default Register;
