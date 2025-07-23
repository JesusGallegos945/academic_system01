import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Stack, Grid } from '@mui/material';

const API_URL = 'http://localhost:3000/api';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    name: '',
    code: '',
    credits: ''
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${API_URL}/subjects`);
      const data = await res.json();
      setSubjects(Array.isArray(data) ? data : []);
    } catch {
      setError('Error al obtener materias');
    }
  };

  useEffect(() => {
    fetchSubjects();
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
      const res = await fetch(`${API_URL}/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          code: form.code,
          credits: Number(form.credits)
        })
      });
      if (!res.ok) throw new Error();
      setForm({ name: '', code: '', credits: '' });
      setSuccess('Materia creada exitosamente');
      fetchSubjects();
    } catch {
      setError('Error al crear materia');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/subjects/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error();
      setSuccess('Materia eliminada');
      fetchSubjects();
    } catch {
      setError('Error al eliminar materia');
    }
  };

  const handleEdit = (subject) => {
    setEditId(subject._id || subject.id);
    setEditForm({
      name: subject.name,
      code: subject.code,
      credits: subject.credits
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/subjects/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          code: editForm.code,
          credits: Number(editForm.credits)
        })
      });
      if (!res.ok) throw new Error();
      setEditId(null); setEditForm({});
      setSuccess('Materia actualizada exitosamente');
      fetchSubjects();
    } catch {
      setError('Error al actualizar materia');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '2rem auto' }}>
      <Typography variant="h4" fontWeight={700} align="center" gutterBottom>Materias</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Card sx={{ mb: 4, p: 2, bgcolor: 'background.paper', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Crear nueva materia</Typography>
          <Box component="form" onSubmit={handleCreate} autoComplete="off">
            <Stack spacing={2}>
              <TextField name="name" label="Nombre de la materia" value={form.name} onChange={handleChange} required fullWidth />
              <TextField name="code" label="Código" value={form.code} onChange={handleChange} required fullWidth />
              <TextField name="credits" type="number" label="Acreditación" value={form.credits} onChange={handleChange} required fullWidth inputProps={{ min: 1, max: 20 }} />
              <Button type="submit" variant="contained" color="primary" size="large">Crear</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        {subjects.map(subject => (
          <Grid item xs={12} md={6} key={subject._id || subject.id}>
            <Card sx={{ bgcolor: 'background.paper', boxShadow: 2 }}>
              <CardContent>
                {editId === (subject._id || subject.id) ? (
                  <Box component="form" onSubmit={handleUpdate} autoComplete="off">
                    <Stack spacing={2}>
                      <TextField name="name" label="Nombre de la materia" value={editForm.name} onChange={handleEditChange} required fullWidth />
                      <TextField name="code" label="Código" value={editForm.code} onChange={handleEditChange} required fullWidth />
                      <TextField name="credits" type="number" label="Acreditación" value={editForm.credits} onChange={handleEditChange} required fullWidth inputProps={{ min: 1, max: 20 }} />
                      <Stack direction="row" spacing={2}>
                        <Button type="submit" variant="contained" color="primary">Guardar</Button>
                        <Button type="button" variant="outlined" color="secondary" onClick={() => setEditId(null)}>Cancelar</Button>
                      </Stack>
                    </Stack>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h6" fontWeight={700}>{subject.name}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Código: {subject.code} | Acreditación: {subject.credits}</Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Button variant="outlined" color="primary" onClick={() => handleEdit(subject)}>Editar</Button>
                      <Button variant="outlined" color="error" onClick={() => handleDelete(subject._id || subject.id)}>Eliminar</Button>
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

export default Subjects; 