import User from "../models/user.js";
import Career from "../models/careers.js";
import bcrypt from "bcryptjs";
import { createdAccessToken } from "../libs/jwt.js";


export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });
    const userSaved = await newUser.save();
    const token = await createdAccessToken({ id: userSaved._id });

    res.cookie("token", token);
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAT: userSaved.createdAt,
      updatedAT: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: "Invalid credential, try again" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credential, try again" });

    const token = await createdAccessToken({ id: userFound._id });

    res.cookie("token", token),
      res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAT: userFound.createdAt,
        updatedAT: userFound.updateAt,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });

  return res.sendStatus(200);
};

export const profile = async (req, res) => {
    //console.log(req.user);
    const userFound = await User.findById(req.user.id);

    if(!userFound)
        return res.status(400).json({ message: "User not found :("});

    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
    })
    //res.send('profile');
}

// ... (tus funciones existentes de auth)

// Career Controllers
export const createCareer = async (req, res) => {
  try {
    const { career_code, career_name, career_description, quarter_duration, modality, coordinator } = req.body;
    
    const careerExists = await Career.findOne({ career_code });
    if (careerExists) return res.status(400).json({ message: "Career code already exists" });

    const newCareer = new Career({
      career_code,
      career_name,
      career_description,
      quarter_duration,
      modality,
      coordinator
    });

    const careerSaved = await newCareer.save();
    res.json(careerSaved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCareers = async (req, res) => {
  try {
    const careers = await Career.find();
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: "Career not found" });
    res.json(career);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCareer = async (req, res) => {
  try {
    const updatedCareer = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCareer) return res.status(404).json({ message: "Career not found" });
    res.json(updatedCareer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ message: "Career not found" });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};