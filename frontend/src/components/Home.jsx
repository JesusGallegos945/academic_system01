import React from 'react';
import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';

const Home = ({ navigate }) => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
    <Card sx={{ minWidth: 350, maxWidth: 500, p: 2, bgcolor: 'background.paper', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
          Bienvenido al Sistema Académico
        </Typography>
        <Typography align="center" sx={{ mb: 3 }}>
          Por favor, inicia sesión o regístrate para continuar.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" onClick={() => navigate('login')} size="large">
            Ir a Login
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate('register')} size="large">
            Ir a Registro
          </Button>
        </Stack>
      </CardContent>
    </Card>
  </Box>
);

export default Home;