import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Stack, Grid } from '@mui/material';

const API_URL = 'http://localhost:3000/api';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState({
    name: '',
    subjectId: '',
    teacherId: '',
    schedule: '',
    academicPeriod: '',
    studentEnrolled_studentId: '',
    studentEnrolled_enrollmentDate: ''
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchGroups = async () => {
    try {
      const res = await fetch(`${API_URL}/groups`);
      const data = await res.json();
      setGroups(Array.isArray(data) ? data : []);
    } catch {
      setError('Error al obtener grupos');
    }
  };

  useEffect(() => {
    fetchGroups();
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
      const res = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          subjectId: form.subjectId || undefined,
          teacherId: form.teacherId || undefined,
          schedule: form.schedule,
          academicPeriod: form.academicPeriod,
          studentEnrolled: {
            studentId: form.studentEnrolled_studentId || undefined,
            enrollmentDate: form.studentEnrolled_enrollmentDate || undefined
          }
        })
      });
      if (!res.ok) throw new Error();
      setForm({ name: '', subjectId: '', teacherId: '', schedule: '', academicPeriod: '', studentEnrolled_studentId: '', studentEnrolled_enrollmentDate: '' });
      setSuccess('Grupo creado exitosamente');
      fetchGroups();
    } catch {
      setError('Error al crear grupo');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/groups/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error();
      setSuccess('Grupo eliminado');
      fetchGroups();
    } catch {
      setError('Error al eliminar grupo');
    }
  };

  const handleEdit = (group) => {
    setEditId(group._id || group.id);
    setEditForm({
      name: group.name,
      subjectId: group.subjectId || '',
      teacherId: group.teacherId || '',
      schedule: group.schedule,
      academicPeriod: group.academicPeriod,
      studentEnrolled_studentId: group.studentEnrolled?.studentId || '',
      studentEnrolled_enrollmentDate: group.studentEnrolled?.enrollmentDate ? group.studentEnrolled.enrollmentDate.slice(0, 10) : ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/groups/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          subjectId: editForm.subjectId || undefined,
          teacherId: editForm.teacherId || undefined,
          schedule: editForm.schedule,
          academicPeriod: editForm.academicPeriod,
          studentEnrolled: {
            studentId: editForm.studentEnrolled_studentId || undefined,
            enrollmentDate: editForm.studentEnrolled_enrollmentDate || undefined
          }
        })
      });
      if (!res.ok) throw new Error();
      setEditId(null); setEditForm({});
      setSuccess('Grupo actualizado exitosamente');
      fetchGroups();
    } catch {
      setError('Error al actualizar grupo');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '2rem auto' }}>
      <Typography variant="h4" fontWeight={700} align="center" gutterBottom>Grupos</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Card sx={{ mb: 4, p: 2, bgcolor: 'background.paper', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Crear nuevo grupo</Typography>
          <Box component="form" onSubmit={handleCreate} autoComplete="off">
            <Stack spacing={2}>
              <TextField name="name" label="Nombre del grupo" value={form.name} onChange={handleChange} required fullWidth />
              <TextField name="subjectId" label="ID de materia (opcional)" value={form.subjectId} onChange={handleChange} fullWidth />
              <TextField name="teacherId" label="ID de profesor (opcional)" value={form.teacherId} onChange={handleChange} fullWidth />
              <TextField name="schedule" label="Horario" value={form.schedule} onChange={handleChange} required fullWidth />
              <TextField name="academicPeriod" label="Periodo académico" value={form.academicPeriod} onChange={handleChange} required fullWidth />
              <TextField name="studentEnrolled_studentId" label="ID de estudiante (opcional)" value={form.studentEnrolled_studentId} onChange={handleChange} fullWidth />
              <TextField name="studentEnrolled_enrollmentDate" type="date" label="Fecha de inscripción (opcional)" value={form.studentEnrolled_enrollmentDate} onChange={handleChange} fullWidth />
              <Button type="submit" variant="contained" color="primary" size="large">Crear</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        {groups.map(group => (
          <Grid item xs={12} md={6} key={group._id || group.id}>
            <Card sx={{ bgcolor: 'background.paper', boxShadow: 2 }}>
              <CardContent>
                {editId === (group._id || group.id) ? (
                  <Box component="form" onSubmit={handleUpdate} autoComplete="off">
                    <Stack spacing={2}>
                      <TextField name="name" label="Nombre del grupo" value={editForm.name} onChange={handleEditChange} required fullWidth />
                      <TextField name="subjectId" label="ID de materia (opcional)" value={editForm.subjectId} onChange={handleEditChange} fullWidth />
                      <TextField name="teacherId" label="ID de profesor (opcional)" value={editForm.teacherId} onChange={handleEditChange} fullWidth />
                      <TextField name="schedule" label="Horario" value={editForm.schedule} onChange={handleEditChange} required fullWidth />
                      <TextField name="academicPeriod" label="Periodo académico" value={editForm.academicPeriod} onChange={handleEditChange} required fullWidth />
                      <TextField name="studentEnrolled_studentId" label="ID de estudiante (opcional)" value={editForm.studentEnrolled_studentId} onChange={handleEditChange} fullWidth />
                      <TextField name="studentEnrolled_enrollmentDate" type="date" label="Fecha de inscripción (opcional)" value={editForm.studentEnrolled_enrollmentDate} onChange={handleEditChange} fullWidth />
                      <Stack direction="row" spacing={2}>
                        <Button type="submit" variant="contained" color="primary">Guardar</Button>
                        <Button type="button" variant="outlined" color="secondary" onClick={() => setEditId(null)}>Cancelar</Button>
                      </Stack>
                    </Stack>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h6" fontWeight={700}>{group.name}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Horario: {group.schedule} | Periodo: {group.academicPeriod}</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>Materia: {group.subjectId} | Profesor: {group.teacherId}</Typography>
                    <Typography variant="body2">Estudiante: {group.studentEnrolled?.studentId} ({group.studentEnrolled?.enrollmentDate?.slice(0, 10)})</Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Button variant="outlined" color="primary" onClick={() => handleEdit(group)}>Editar</Button>
                      <Button variant="outlined" color="error" onClick={() => handleDelete(group._id || group.id)}>Eliminar</Button>
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

export default Groups; 