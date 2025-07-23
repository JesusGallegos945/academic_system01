import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    credits: {
        type: Number,
        required: true
    },
    careerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Career',
        required: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Subject', subjectSchema); 