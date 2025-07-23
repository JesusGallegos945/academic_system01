import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    hireDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    subjectsTaught: {
        type: String, // ahora es un solo string, no array
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Teacher', teacherSchema); 