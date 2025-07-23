import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Careers from './components/Careers';
import Students from './components/Students';
import Teachers from './components/Teachers';
import Groups from './components/Groups';
import Subjects from './components/Subjects';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#181818',
      paper: '#232323',
    },
    primary: {
      main: '#ff0000',
    },
    secondary: {
      main: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = (page) => setCurrentPage(page);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('careers');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('home');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static" color="default" sx={{ background: '#181818', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff', fontWeight: 700 }}>
            Sistema Académico
          </Typography>
          {isLoggedIn && (
            <>
              <Button color="inherit" onClick={() => navigate('home')}>Inicio</Button>
              <Button color="inherit" onClick={() => navigate('careers')}>Carreras</Button>
              <Button color="inherit" onClick={() => navigate('students')}>Estudiantes</Button>
              <Button color="inherit" onClick={() => navigate('teachers')}>Profesores</Button>
              <Button color="inherit" onClick={() => navigate('groups')}>Grupos</Button>
              <Button color="inherit" onClick={() => navigate('subjects')}>Materias</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ minHeight: '80vh', py: 4 }}>
        {currentPage === 'home' && <Home navigate={navigate} />}
        {currentPage === 'login' && <Login onLogin={handleLogin} />}
        {currentPage === 'register' && <Register navigate={navigate} />}
        {currentPage === 'careers' && <Careers />}
        {currentPage === 'students' && <Students />}
        {currentPage === 'teachers' && <Teachers />}
        {currentPage === 'groups' && <Groups />}
        {currentPage === 'subjects' && <Subjects />}
      </Container>
      <Box component="footer" sx={{ bgcolor: '#232323', color: '#fff', py: 3, textAlign: 'center', borderTop: '1px solid #333' }}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Sistema Académico — Remedial Unidad 2 — Desarrollado por Jesús Gallegos Gaspar
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
