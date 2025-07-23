import mongoose from 'mongoose';

const coordinatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { _id: false });

const careerSchema = new mongoose.Schema({
  career_code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  career_name: {
    type: String,
    required: true,
    trim: true
  },
  career_description: {
    type: String,
    required: true,
    trim: true
  },
  quarter_duration: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  modality: {
    type: String,
    required: true,
    enum: ['Presencial', 'En linea', 'Hibrido', 'Dual']
  },
  creation_date: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  },
  coordinator: coordinatorSchema
}, {
  timestamps: true
});

export default mongoose.model('Career', careerSchema);