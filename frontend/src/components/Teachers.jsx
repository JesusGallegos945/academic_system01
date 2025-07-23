import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Stack, Grid, MenuItem } from '@mui/material';

const API_URL = 'http://localhost:3000/api';
const STATUS = ['active', 'inactive'];

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    specialization: '',
    hireDate: '',
    status: 'active',
    subjectsTaught: ''
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API_URL}/teachers`);
      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch {
      setError('Error al obtener profesores');
    }
  };

  useEffect(() => {
    fetchTeachers();
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
      const res = await fetch(`${API_URL}/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          specialization: form.specialization,
          hireDate: form.hireDate,
          status: form.status,
          subjectsTaught: form.subjectsTaught
        })
      });
      if (!res.ok) throw new Error();
      setForm({ nombre: '', apellido: '', specialization: '', hireDate: '', status: 'active', subjectsTaught: '' });
      setSuccess('Profesor creado exitosamente');
      fetchTeachers();
    } catch {
      setError('Error al crear profesor');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/teachers/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error();
      setSuccess('Profesor eliminado');
      fetchTeachers();
    } catch {
      setError('Error al eliminar profesor');
    }
  };

  const handleEdit = (teacher) => {
    setEditId(teacher._id || teacher.id);
    setEditForm({
      nombre: teacher.nombre,
      apellido: teacher.apellido,
      specialization: teacher.specialization,
      hireDate: teacher.hireDate ? teacher.hireDate.slice(0, 10) : '',
      status: teacher.status,
      subjectsTaught: teacher.subjectsTaught
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/teachers/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: editForm.nombre,
          apellido: editForm.apellido,
          specialization: editForm.specialization,
          hireDate: editForm.hireDate,
          status: editForm.status,
          subjectsTaught: editForm.subjectsTaught
        })
      });
      if (!res.ok) throw new Error();
      setEditId(null); setEditForm({});
      setSuccess('Profesor actualizado exitosamente');
      fetchTeachers();
    } catch {
      setError('Error al actualizar profesor');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '2rem auto' }}>
      <Typography variant="h4" fontWeight={700} align="center" gutterBottom>Profesores</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Card sx={{ mb: 4, p: 2, bgcolor: 'background.paper', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Crear nuevo profesor</Typography>
          <Box component="form" onSubmit={handleCreate} autoComplete="off">
            <Stack spacing={2}>
              <TextField name="nombre" label="Nombre" value={form.nombre} onChange={handleChange} required fullWidth />
              <TextField name="apellido" label="Apellido" value={form.apellido} onChange={handleChange} required fullWidth />
              <TextField name="specialization" label="Especialidad" value={form.specialization} onChange={handleChange} required fullWidth />
              <TextField name="hireDate" type="date" label="Fecha de contratación" value={form.hireDate} onChange={handleChange} required fullWidth />
              <TextField name="status" select label="Estado" value={form.status} onChange={handleChange} required fullWidth>
                {STATUS.map(s => <MenuItem key={s} value={s}>{s === 'active' ? 'Activo' : 'Inactivo'}</MenuItem>)}
              </TextField>
              <TextField name="subjectsTaught" label="Materia que imparte" value={form.subjectsTaught} onChange={handleChange} required fullWidth />
              <Button type="submit" variant="contained" color="primary" size="large">Crear</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        {teachers.map(teacher => (
          <Grid item xs={12} md={6} key={teacher._id || teacher.id}>
            <Card sx={{ bgcolor: 'background.paper', boxShadow: 2 }}>
              <CardContent>
                {editId === (teacher._id || teacher.id) ? (
                  <Box component="form" onSubmit={handleUpdate} autoComplete="off">
                    <Stack spacing={2}>
                      <TextField name="nombre" label="Nombre" value={editForm.nombre} onChange={handleEditChange} required fullWidth />
                      <TextField name="apellido" label="Apellido" value={editForm.apellido} onChange={handleEditChange} required fullWidth />
                      <TextField name="specialization" label="Especialidad" value={editForm.specialization} onChange={handleEditChange} required fullWidth />
                      <TextField name="hireDate" type="date" label="Fecha de contratación" value={editForm.hireDate} onChange={handleEditChange} required fullWidth />
                      <TextField name="status" select label="Estado" value={editForm.status} onChange={handleEditChange} required fullWidth>
                        {STATUS.map(s => <MenuItem key={s} value={s}>{s === 'active' ? 'Activo' : 'Inactivo'}</MenuItem>)}
                      </TextField>
                      <TextField name="subjectsTaught" label="Materia que imparte" value={editForm.subjectsTaught} onChange={handleEditChange} required fullWidth />
                      <Stack direction="row" spacing={2}>
                        <Button type="submit" variant="contained" color="primary">Guardar</Button>
                        <Button type="button" variant="outlined" color="secondary" onClick={() => setEditId(null)}>Cancelar</Button>
                      </Stack>
                    </Stack>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h6" fontWeight={700}>{teacher.nombre} {teacher.apellido}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>{teacher.specialization} | {teacher.status === 'active' ? 'Activo' : 'Inactivo'}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>Materia: {teacher.subjectsTaught}</Typography>
                    <Typography variant="body2">Contratación: {teacher.hireDate?.slice(0, 10)}</Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Button variant="outlined" color="primary" onClick={() => handleEdit(teacher)}>Editar</Button>
                      <Button variant="outlined" color="error" onClick={() => handleDelete(teacher._id || teacher.id)}>Eliminar</Button>
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

export default Teachers; 