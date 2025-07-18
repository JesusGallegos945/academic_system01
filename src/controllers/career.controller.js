import Career from '../models/career.js';
import bcrypt from 'bcryptjs';
import { createdAccessToken } from '../libs/jwt.js';

export const createCareer = async (req, res) => {
  try {
    const { career_code, career_name, career_description, quarter_duration, modality, coordinator } = req.body;
    
    // Validar código único
    const careerExists = await Career.findOne({ career_code });
    if (careerExists) {
      return res.status(400).json({ message: "El código de carrera ya existe" });
    }

    const newCareer = new Career({
      career_code: career_code.toUpperCase(),
      career_name,
      career_description,
      quarter_duration,
      modality,
      coordinator
    });

    const careerSaved = await newCareer.save();
    res.status(201).json({
      ...careerSaved._doc,
      years_duration: (careerSaved.quarter_duration / 4).toFixed(1)
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCareers = async (req, res) => {
  try {
    const careers = await Career.find({ active: true });
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ message: "Carrera no encontrada" });
    }
    res.json({
      ...career._doc,
      years_duration: (career.quarter_duration / 4).toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCareer = async (req, res) => {
  try {
    if (req.body.career_code) {
      req.body.career_code = req.body.career_code.toUpperCase();
    }
    
    const updatedCareer = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedCareer) {
      return res.status(404).json({ message: "Carrera no encontrada" });
    }
    
    res.json(updatedCareer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    
    if (!career) {
      return res.status(404).json({ message: "Carrera no encontrada" });
    }
    
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};