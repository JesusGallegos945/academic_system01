import Career from '../models/career.js';

export const createCareer = async (req, res) => {
  try {
    const { career_code, career_name, career_description, quarter_duration, modality, coordinator } = req.body;
    // Validación básica
    if (!career_code || !career_name || !quarter_duration || !modality || !coordinator?.name || !coordinator?.email) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos",
        requiredFields: ["career_code", "career_name", "career_description", "quarter_duration", "modality", "coordinator.name", "coordinator.email"]
      });
    }
    // Validar código único
    const careerExists = await Career.findOne({ career_code: career_code.toUpperCase() });
    if (careerExists) {
      return res.status(409).json({
        success: false,
        message: "El código de carrera ya existe",
        existingCareer: {
          id: careerExists._id,
          code: careerExists.career_code,
          name: careerExists.career_name
        }
      });
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
      success: true,
      message: "Carrera creada exitosamente",
      data: careerSaved
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la carrera",
      error: error.message,
      ...(error.name === "ValidationError" && {
        validationErrors: error.errors
      })
    });
  }
};

export const getCareers = async (req, res) => {
  try {
    // Opciones de filtrado (pueden venir de query params)
    const filter = { active: true };
    const { modality } = req.query;
    
    if (modality) {
      filter.modality = modality;
    }

    const careers = await Career.find(filter).sort({ career_name: 1 });
    
    // Calcular años de duración para cada carrera
    const careersWithYears = careers.map(career => ({
      ...career._doc,
      years_duration: (career.quarter_duration / 4).toFixed(1)
    }));

    res.json({
      success: true,
      count: careers.length,
      data: careersWithYears
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las carreras",
      error: error.message
    });
  }
};

export const getCareer = async (req, res) => {
  try {
    // Validar formato del ID
    if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: "Formato de ID inválido",
        details: "El ID debe tener 24 caracteres hexadecimales"
      });
    }

    const career = await Career.findById(req.params.id);
    
    if (!career) {
      return res.status(404).json({ 
        success: false,
        message: "Carrera no encontrada",
        requestedId: req.params.id
      });
    }

    res.json({
      success: true,
      data: {
        ...career._doc,
        years_duration: (career.quarter_duration / 4).toFixed(1)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error al obtener la carrera",
      error: error.message
    });
  }
};

export const updateCareer = async (req, res) => {
  try {
    // Validación de ID
    if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: "ID inválido",
        details: "El ID debe tener 24 caracteres hexadecimales"
      });
    }

    // Normalización de datos
    if (req.body.career_code) {
      req.body.career_code = req.body.career_code.toUpperCase();
    }

    const updatedCareer = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (!updatedCareer) {
      return res.status(404).json({ 
        success: false,
        message: "No se encontró la carrera para actualizar",
        requestedId: req.params.id
      });
    }
    
    res.json({
      success: true,
      message: "Carrera actualizada exitosamente",
      data: updatedCareer
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error al actualizar la carrera",
      error: error.message,
      ...(error.code === 11000 && { 
        duplicateField: error.keyValue,
        suggestion: "El código de carrera debe ser único"
      })
    });
  }
};

export const deleteCareer = async (req, res) => {
  try {
    // Validación de ID
    if (!req.params.id || !/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: "ID inválido",
        details: "El ID debe tener 24 caracteres hexadecimales"
      });
    }

    const career = await Career.findByIdAndUpdate(
      req.params.id,
      { 
        active: false,
        deletedAt: new Date()
      },
      { new: true }
    );
    
    if (!career) {
      return res.status(404).json({ 
        success: false,
        message: "No se encontró la carrera para eliminar",
        requestedId: req.params.id
      });
    }
    
    res.json({
      success: true,
      message: "Carrera desactivada exitosamente",
      data: {
        id: career._id,
        career_code: career.career_code,
        deactivatedAt: career.deletedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error al desactivar la carrera",
      error: error.message
    });
  }
};