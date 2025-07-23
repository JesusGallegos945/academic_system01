import mongoose from 'mongoose';

const studentsEnrolledSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false },
    enrollmentDate: { type: Date, required: false }
}, { _id: false });

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: false // Ahora es opcional
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: false // Ahora es opcional
    },
    schedule: {
        type: String,
        required: true
    },
    academicPeriod: {
        type: String,
        required: true
    },
    studentsEnrolled: [studentsEnrolledSchema]
}, {
    timestamps: true
});

export default mongoose.model('Group', groupSchema); 