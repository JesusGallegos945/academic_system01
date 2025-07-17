import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  career_code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return /^[A-Z]{3}\d{3}$/.test(v); // Ejemplo: DSM001
      },
      message: props => `${props.value} no es un código válido (formato: LLLNNN)`
    }
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
    enum: ['Presencial', 'En línea', 'Híbrido', 'Dual']
  },
  creation_date: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  },
  coordinator: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, 'Por favor ingresa un email válido']
      }
    }, { _id: false })
  }
}, {
  timestamps: true
});

export default mongoose.model('Career', careerSchema);