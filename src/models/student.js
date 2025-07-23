import mongoose from 'mongoose';

const enrolledGroupSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: false },
    enrollmentDate: { type: Date, required: false },
    finalGrade: { type: Number }
}, { _id: false });

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Ahora es opcional
    },
    enrollmentNumber: {
        type: String,
        required: true,
        unique: true
    },
    admissionDate: {
        type: Date,
        required: true
    },
    careerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Career',
        required: false // Ahora es opcional
    },
    currentSemester: {
        type: Number,
        required: true
    },
    enrolledGroups: [enrolledGroupSchema]
}, {
    timestamps: true
});

export default mongoose.model('Student', studentSchema); 