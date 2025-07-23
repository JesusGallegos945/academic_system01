import mongoose from 'mongoose';
import Teacher from './src/models/teacher.js';
import Student from './src/models/student.js';
import Group from './src/models/group.js';

const CONNECTION_STRING = 'mongodb+srv://jisus0945:mWoQb0giD8mXV9A9@academic-system-closter.nxphzi8.mongodb.net/academyc-system_db01?retryWrites=true&w=majority&appName=Academic-system-closter';

async function insertData() {
  await mongoose.connect(CONNECTION_STRING);

  // Insertar teachers
  const teachers = await Teacher.create([
    {
      nombre: 'Ana',
      apellido: 'García',
      specialization: 'Matemáticas',
      hireDate: new Date('2022-08-15'),
      status: 'active',
      subjectsTaught: 'Álgebra'
    },
    {
      nombre: 'Luis',
      apellido: 'Martínez',
      specialization: 'Redes',
      hireDate: new Date('2021-02-10'),
      status: 'inactive',
      subjectsTaught: 'Redes de Computadoras'
    }
  ]);

  // Insertar students
  const students = await Student.create([
    {
      enrollmentNumber: 'ALU-2024-200',
      admissionDate: new Date('2024-07-01'),
      currentSemester: 1,
      enrolledGroup: {
        groupId: null,
        enrollmentDate: null,
        finalGrade: null
      }
    },
    {
      enrollmentNumber: 'ALU-2024-201',
      admissionDate: new Date('2024-07-02'),
      currentSemester: 2,
      enrolledGroup: {
        groupId: null,
        enrollmentDate: null,
        finalGrade: null
      }
    }
  ]);

  // Insertar groups
  await Group.create([
    {
      name: 'TI 77',
      subjectId: null,
      teacherId: teachers[0]._id,
      schedule: 'Lunes 08:00-10:00',
      academicPeriod: '2024-2',
      studentEnrolled: {
        studentId: students[0]._id,
        enrollmentDate: new Date('2024-07-05')
      }
    },
    {
      name: 'TI 88',
      subjectId: null,
      teacherId: teachers[1]._id,
      schedule: 'Martes 10:00-12:00',
      academicPeriod: '2024-2',
      studentEnrolled: {
        studentId: students[1]._id,
        enrollmentDate: new Date('2024-07-06')
      }
    }
  ]);

  console.log('Nuevos teachers, students y groups válidos insertados (usando objetos, no arrays).');
  await mongoose.disconnect();
}

insertData().catch(err => {
  console.error('Error al insertar datos:', err);
  mongoose.disconnect();
}); 