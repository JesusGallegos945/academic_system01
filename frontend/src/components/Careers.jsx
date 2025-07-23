import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Stack, Grid, MenuItem } from '@mui/material';

const API_URL = 'http://localhost:3000/api';
const MODALITIES = ['Presencial', 'En linea', 'Hibrido', 'Dual'];

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [form, setForm] = useState({
    career_code: '',
    career_name: '',
    career_description: '',
    quarter_duration: '',
    modality: MODALITIES[0],
    coordinator_name: '',
    coordinator_email: ''
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCareers = async () => {
    try {
      const res = await fetch(`${API_URL}/get-careers`);
      const data = await res.json();
      setCareers(Array.isArray(data.data) ? data.data : []);
    } catch {
      setError('Error al obtener carreras');
    }
  };

  useEffect(() => {
    fetchCareers();
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
      const res = await fetch(`${API_URL}/create-careers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career_code: form.career_code,
          career_name: form.career_name,
          career_description: form.career_description,
          quarter_duration: Number(form.quarter_duration),
          modality: form.modality,
          coordinator: {
            name: form.coordinator_name,
            email: form.coordinator_email
          }
        }),
        credentials: 'include'
      });
      if (!res.ok) throw new Error();
      setForm({
        career_code: '',
        career_name: '',
        career_description: '',
        quarter_duration: '',
        modality: MODALITIES[0],
        coordinator_name: '',
        coordinator_email: ''
      });
      setSuccess('Carrera creada exitosamente');
      fetchCareers();
    } catch {
      setError('Error al crear carrera');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/delete-careers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error();
      setSuccess('Carrera eliminada');
      fetchCareers();
    } catch {
      setError('Error al eliminar carrera');
    }
  };

  const handleEdit = (career) => {
    setEditId(career._id || career.id);
    setEditForm({
      career_code: career.career_code,
      career_name: career.career_name,
      career_description: career.career_description,
      quarter_duration: career.quarter_duration,
      modality: career.modality,
      coordinator_name: career.coordinator?.name || '',
      coordinator_email: career.coordinator?.email || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/update-careers/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          career_code: editForm.career_code,
          career_name: editForm.career_name,
          career_description: editForm.career_description,
          quarter_duration: Number(editForm.quarter_duration),
          modality: editForm.modality,
          coordinator: {
            name: editForm.coordinator_name,
            email: editForm.coordinator_email
          }
        })
      });
      if (!res.ok) throw new Error();
      setEditId(null); setEditForm({});
      setSuccess('Carrera actualizada exitosamente');
      fetchCareers();
    } catch {
      setError('Error al actualizar carrera');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '2rem auto' }}>
      <Typography variant="h4" fontWeight={700} align="center" gutterBottom>Carreras</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Card sx={{ mb: 4, p: 2, bgcolor: 'background.paper', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Crear nueva carrera</Typography>
          <Box component="form" onSubmit={handleCreate} autoComplete="off">
            <Stack spacing={2}>
              <TextField name="career_code" label="Código (ej: DSM001)" value={form.career_code} onChange={handleChange} required fullWidth />
              <TextField name="career_name" label="Nombre" value={form.career_name} onChange={handleChange} required fullWidth />
              <TextField name="career_description" label="Descripción" value={form.career_description} onChange={handleChange} required fullWidth />
              <TextField name="quarter_duration" type="number" label="Duración en cuatrimestres" value={form.quarter_duration} onChange={handleChange} required fullWidth inputProps={{ min: 1, max: 20 }} />
              <TextField name="modality" select label="Modalidad" value={form.modality} onChange={handleChange} required fullWidth>
                {MODALITIES.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
              <TextField name="coordinator_name" label="Nombre del coordinador" value={form.coordinator_name} onChange={handleChange} required fullWidth />
              <TextField name="coordinator_email" type="email" label="Email del coordinador" value={form.coordinator_email} onChange={handleChange} required fullWidth />
              <Button type="submit" variant="contained" color="primary" size="large">Crear</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        {careers.map(career => (
          <Grid item xs={12} md={6} key={career._id || career.id}>
            <Card sx={{ bgcolor: 'background.paper', boxShadow: 2 }}>
              <CardContent>
                {editId === (career._id || career.id) ? (
                  <Box component="form" onSubmit={handleUpdate} autoComplete="off">
                    <Stack spacing={2}>
                      <TextField name="career_code" label="Código" value={editForm.career_code} onChange={handleEditChange} required fullWidth />
                      <TextField name="career_name" label="Nombre" value={editForm.career_name} onChange={handleEditChange} required fullWidth />
                      <TextField name="career_description" label="Descripción" value={editForm.career_description} onChange={handleEditChange} required fullWidth />
                      <TextField name="quarter_duration" type="number" label="Duración en cuatrimestres" value={editForm.quarter_duration} onChange={handleEditChange} required fullWidth inputProps={{ min: 1, max: 20 }} />
                      <TextField name="modality" select label="Modalidad" value={editForm.modality} onChange={handleEditChange} required fullWidth>
                        {MODALITIES.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                      </TextField>
                      <TextField name="coordinator_name" label="Nombre del coordinador" value={editForm.coordinator_name} onChange={handleEditChange} required fullWidth />
                      <TextField name="coordinator_email" type="email" label="Email del coordinador" value={editForm.coordinator_email} onChange={handleEditChange} required fullWidth />
                      <Stack direction="row" spacing={2}>
                        <Button type="submit" variant="contained" color="primary">Guardar</Button>
                        <Button type="button" variant="outlined" color="secondary" onClick={() => setEditId(null)}>Cancelar</Button>
                      </Stack>
                    </Stack>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h6" fontWeight={700}>{career.career_code} - {career.career_name}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>{career.modality} | {career.quarter_duration} cuatrimestres</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{career.career_description}</Typography>
                    <Typography variant="body2">Coordinador: {career.coordinator?.name} ({career.coordinator?.email})</Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Button variant="outlined" color="primary" onClick={() => handleEdit(career)}>Editar</Button>
                      <Button variant="outlined" color="error" onClick={() => handleDelete(career._id || career.id)}>Eliminar</Button>
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

export default Careers; 