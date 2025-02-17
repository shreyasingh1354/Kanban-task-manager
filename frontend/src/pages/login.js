import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Paper, IconButton, InputAdornment, Divider, Checkbox, FormControlLabel } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Import the SVG illustration
import Illustration from '../assets/loginilus.svg';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Data:', formData);
  };

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={6} sx={{ display: 'flex', width: '100%', maxWidth: 900, borderRadius: 3, overflow: 'hidden' }}>
        
        {/* Left Section - Login Form */}
        <Box sx={{ flex: 1, padding: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>Kanban Task Manager</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>Welcome back! Select method to log in:</Typography>

          {/* Social Logins */}
          <Box display="flex" gap={2} mb={2}>
            <Button variant="outlined" startIcon={<GoogleIcon />} fullWidth>Google</Button>
            <Button variant="outlined" startIcon={<FacebookIcon />} fullWidth>Facebook</Button>
          </Box>

          <Divider sx={{ my: 2 }}>or continue with email</Divider>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>Log in</Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>Don't have an account? <span style={{ color: '#1976d2', cursor: 'pointer' }}>Create an account</span></Typography>
          </Box>
        </Box>

        {/* Right Section - Illustration with SVG */}
        <Box sx={{ 
          flex: 1, 
          background: '#0A66C2', 
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

export default Login;
