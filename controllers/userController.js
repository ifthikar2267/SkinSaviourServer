import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User doesn't exist please Sign Up first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user.id);
      res.json({ success: true, token, user: { name: user.name } });
    } else {
      res.json({ success: false, message: 'Invalid credentials'});
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //checking user already exist or not
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "User already exist" });
    }

    //validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user.id);

    res.json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Route for admin panel
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email, role: "admin" },  // Ensure role is included
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("Admin login successful. Token:", token);
      return res.json({ success: true, token, role: "admin" });
    } 

    return res.status(403).json({ success: false, message: "Invalid Credentials" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const getUserDetails = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("password"); // Exclude password
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export { loginUser, registerUser, adminLogin, getUserDetails };



