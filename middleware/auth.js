import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authUser = async (req, res, next) => {
 // const { token } = req.headers;
 let token = req.header("Authorization");

  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }


  try {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim(); 
     }

    // Verify token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    req.user = await userModel.findById(token_decode.id).select("password");
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Invalid token" });
  }
};

export default authUser;
