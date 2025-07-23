import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Stack, MenuItem } from '@mui/material';

const API_URL = 'http://localhost:3000/api';
const ROLES = ['teacher', 'student'];

const Register = ({ onRegister, navigate }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teacher');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          role
        }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setSuccess('Registro exitoso. Redirigiendo al login...');
        setTimeout(() => {
          if (navigate) navigate('login');
          if (onRegister) onRegister();
        }, 1200);
      } else {
        setError(data.message || 'Error al registrarse');
      }
    } catch (err) {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Card sx={{ minWidth: 350, maxWidth: 400, p: 2, bgcolor: 'background.paper', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom fontWeight={700}>
            Registro
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSubmit} autoComplete="off">
            <Stack spacing={2}>
              <TextField
                label="Usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                fullWidth
                autoFocus
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                fullWidth
              />
              <TextField
                select
                label="Rol"
                value={role}
                onChange={e => setRole(e.target.value)}
                required
                fullWidth
              >
                {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} size="large">
                {loading ? 'Cargando...' : 'Registrarse'}
              </Button>
              <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate && navigate('home')}>
                Volver
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register; 