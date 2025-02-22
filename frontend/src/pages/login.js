import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { 
  Container, TextField, Button, Box, Typography, Paper, IconButton, 
  InputAdornment, Divider, Checkbox, FormControlLabel, Alert 
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Import the SVG illustration
import Illustration from '../assets/loginilus.svg';

const Login = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' }); // ✅ Supports email or phone
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await login(formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
  
      navigate("/dashboard"); // ✅ Redirects after login
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email/phone or password");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={6} sx={{ display: 'flex', width: '100%', maxWidth: 900, borderRadius: 5, overflow: 'hidden' }}>
        
        {/* Left Section - Login Form */}
        <Box sx={{ flex: 1, padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>Task Manager</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>Login with Email or Phone Number:</Typography>

          {/* ✅ Social Logins Restored */}
         
          {/* Show error message if login fails */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email or Phone Number"
              variant="outlined"
              fullWidth
              required
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
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
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <FormControlLabel control={<Checkbox />} label="Remember me" />
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>Forgot Password?</Typography>
            </Box>
            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2, borderRadius: 3}}>Log in</Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Don't have an account? <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate('/register')}>Create an account</span>
            </Typography>
          </Box>
        </Box>

        {/* Right Section - Illustration */}
        <Box sx={{ flex: 1, background: '#885fb6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', padding: 4 }}>
          <img src={Illustration} alt="Illustration" style={{ width: '80%', height: 'auto', filter: 'brightness(1.2)' }} />
        </Box>
        
      </Paper>
    </Container>
  );
};

export default Login;
