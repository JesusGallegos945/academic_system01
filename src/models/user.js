import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    dni: { type: String },
    // Puedes agregar más campos aquí si lo necesitas
}, { _id: false });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['teacher', 'student'],
        required: true,
    },
    profile: profileSchema
}, {
    timestamps: true,
});

export default mongoose.model('User', userSchema);