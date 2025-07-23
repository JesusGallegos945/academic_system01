import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Stack, Grid } from '@mui/material';

const API_URL = 'http://localhost:3000/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    enrollmentNumber: '',
    admissionDate: '',
    currentSemester: '',
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/students`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch {
      setError('Error al obtener estudiantes');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          enrollmentNumber: form.enrollmentNumber,
          admissionDate: form.admissionDate,
          currentSemester: Number(form.currentSemester)
        })
      });
      if (!res.ok) throw new Error();
      setForm({ username: '', email: '', password: '', enrollmentNumber: '', admissionDate: '', currentSemester: '' });
      setSuccess('Estudiante creado exitosamente');
      fetchStudents();
    } catch {
      setError('Error al crear estudiante');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/students/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error();
      setSuccess('Estudiante eliminado');
      fetchStudents();
    } catch {
      setError('Error al eliminar estudiante');
    }
  };

  const handleEdit = (student) => {
    setEditId(student._id || student.id);
    setEditForm({
      username: student.username,
      email: student.email,
      password: '',
      enrollmentNumber: student.enrollmentNumber,
      admissionDate: student.admissionDate ? student.admissionDate.slice(0, 10) : '',
      currentSemester: student.currentSemester
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/students/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: editForm.username,
          email: editForm.email,
          password: editForm.password,
          enrollmentNumber: editForm.enrollmentNumber,
          admissionDate: editForm.admissionDate,
          currentSemester: Number(editForm.currentSemester)
        })
      });
      if (!res.ok) throw new Error();
      setEditId(null); setEditForm({});
      setSuccess('Estudiante actualizado exitosamente');
      fetchStudents();
    } catch {
      setError('Error al actualizar estudiante');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '2rem auto' }}>
      <Typography variant="h4" fontWeight={700} align="center" gutterBottom>Estudiantes</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Card sx={{ mb: 4, p: 2, bgcolor: 'background.paper', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Crear nuevo estudiante</Typography>
          <Box component="form" onSubmit={handleCreate} autoComplete="off">
            <Stack spacing={2}>
              <TextField name="username" label="Usuario" value={form.username} onChange={handleChange} required fullWidth />
              <TextField name="email" label="Email" value={form.email} onChange={handleChange} required fullWidth />
              <TextField name="password" type="password" label="Contraseña" value={form.password} onChange={handleChange} required fullWidth />
              <TextField name="enrollmentNumber" label="Matrícula" value={form.enrollmentNumber} onChange={handleChange} required fullWidth />
              <TextField name="admissionDate" type="date" label="Fecha de admisión" value={form.admissionDate} onChange={handleChange} required fullWidth />
              <TextField name="currentSemester" type="number" label="Semestre actual" value={form.currentSemester} onChange={handleChange} required fullWidth inputProps={{ min: 1, max: 12 }} />
              <Button type="submit" variant="contained" color="primary" size="large">Crear</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        {students.map(student => (
          <Grid item xs={12} md={6} key={student._id || student.id}>
            <Card sx={{ bgcolor: 'background.paper', boxShadow: 2 }}>
              <CardContent>
                {editId === (student._id || student.id) ? (
                  <Box component="form" onSubmit={handleUpdate} autoComplete="off">
                    <Stack spacing={2}>
                      <TextField name="username" label="Usuario" value={editForm.username} onChange={handleEditChange} required fullWidth />
                      <TextField name="email" label="Email" value={editForm.email} onChange={handleEditChange} required fullWidth />
                      <TextField name="password" type="password" label="Contraseña" value={editForm.password} onChange={handleEditChange} required fullWidth />
                      <TextField name="enrollmentNumber" label="Matrícula" value={editForm.enrollmentNumber} onChange={handleEditChange} required fullWidth />
                      <TextField name="admissionDate" type="date" label="Fecha de admisión" value={editForm.admissionDate} onChange={handleEditChange} required fullWidth />
                      <TextField name="currentSemester" type="number" label="Semestre actual" value={editForm.currentSemester} onChange={handleEditChange} required fullWidth inputProps={{ min: 1, max: 12 }} />
                      <Stack direction="row" spacing={2}>
                        <Button type="submit" variant="contained" color="primary">Guardar</Button>
                        <Button type="button" variant="outlined" color="secondary" onClick={() => setEditId(null)}>Cancelar</Button>
                      </Stack>
                    </Stack>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h6" fontWeight={700}>{student.username}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Email: {student.email} | Matrícula: {student.enrollmentNumber}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>Admisión: {student.admissionDate?.slice(0, 10)} | Semestre: {student.currentSemester}</Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Button variant="outlined" color="primary" onClick={() => handleEdit(student)}>Editar</Button>
                      <Button variant="outlined" color="error" onClick={() => handleDelete(student._id || student.id)}>Eliminar</Button>
                    </Stack>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Students; 