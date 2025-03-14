import express from 'express'
import {verifyRazorpay, placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus, getUserLatestOrder} from '../controllers/orderController.js'
import { authMiddleware, adminMiddleware } from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

//Admin features
orderRouter.post('/list', authMiddleware, adminMiddleware, allOrders)
orderRouter.post('/status', authMiddleware, adminMiddleware, updateStatus)

//Payment features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)

//user features
orderRouter.post('/userorders', authUser, userOrders)
orderRouter.post('/latest-order', authUser, getUserLatestOrder); //get User LatestOrder for my profile


//verify payment
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)

export default orderRouter;