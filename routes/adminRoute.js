import express from 'express'
import { authMiddleware, adminMiddleware } from '../middleware/adminAuth.js'
import { adminLogin } from '../controllers/userController.js';



const adminRouter = express.Router();

// Login Route
adminRouter.post('/login', adminLogin);

// Example: Protected Admin Route
adminRouter.get('/admin-dashboard', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ success: true, message: "Welcome to the Admin Dashboard" });
  });
  
export default adminRouter;
