import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from 'razorpay'

//global variable
const currency = 'inr'
const deliveryCharge = 50

//gateway initialize
const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID ,
    key_secret : process.env.RAZORPAY_KEY_SECRET,
})

// Placing order using Cash on Delivery
const placeOrder = async (req, res) => {
    try {
        const {userId, items, totals, shippingAddress } = req.body;

        // Validate fields
        if (!userId || !items || !totals || !shippingAddress) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Check for missing fields in items
        for (let item of items) {
            if (!item.productId || !item.price || !item.price.baseRate || !item.price.total ) {
                return res.status(400).json({ success: false, message: "Incomplete item details" });
            }
        }

        // Fetch user details
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const orderData = {
            userId,
            name: user.name,
            email: user.email,
            items,
            totals,
            shippingAddress,
            paymentMethod: "Cash on Delivery",
            paymentResult: {},
            orderStatus: "Confirmed",
            date: Date.now(),
        };

        // Only add razorpay_order_id for Razorpay orders
        if (req.body.paymentMethod === "razorpay" && req.body.razorpay_order_id) {
          orderData.razorpay_order_id = req.body.razorpay_order_id;
      }
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear cart data
        await userModel.findByIdAndUpdate(userId, { cartData: [] });

        res.json({ success: true, message: "Order Placed Successfully"});

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, totals, shippingAddress } = req.body;

    if (!totals || totals.quantity === undefined || totals.total === undefined) {
      return res.status(400).json({ message: "Totals data is missing" });
    }

    // Fetch user details
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Create Razorpay order (without saving in DB)
    const options = {
      amount: totals.total * 100, // Convert to paise
      currency: "INR",
    };

    razorpayInstance.orders.create(options, async (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
      }

      res.json({ success: true, razorpayOrder: order });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

  
//verify razorpay
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, userId, items, totals, shippingAddress } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, message: "Invalid payment details" });
    }

    // Fetch payment details from Razorpay
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      // Fetch user details
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Create order in database (only if payment is successful)
      const newOrder = new orderModel({
        userId,
        items,
        name: user.name,
        email: user.email,
        totals,
        shippingAddress,
        paymentMethod: "Razorpay",
        isPaid: true,
        paidAt: new Date(),
        orderStatus: "Confirmed",
        razorpay_order_id,
        razorpay_payment_id,
        date: Date.now(),
      });

      const savedOrder = await newOrder.save(); // Save order in DB

      // Clear user cart after successful payment
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      return res.json({ success: true, message: "Payment Successful & Order Created", order: savedOrder });
    } else {
      return res.json({ success: false, message: "Payment Failed. Order not created." });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//All orders data for admin panel
const allOrders = async (req,res) => {

        try {
            
            const orders = await orderModel.find({})
            res.json({success: true, orders})

        } catch (error) {
            
            console.log(error);
        res.status(500).json({ success: false, message: error.message });
        }
}


//user orders data for frontend
const userOrders = async (req,res) => {
    try {
        
        const {userId} = req.body

        const orders = await orderModel.find({userId})
        res.json({success: true , orders})

    } catch (error) {

        console.log(error);
        res.status(500).json({ success: false, message: error.message});
    }
}

//update orders status from admin panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId , orderStatus } = req.body

        await orderModel.findByIdAndUpdate(orderId, {orderStatus})
        res.json({success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message});
    }
}

//get user Address for my user profile
const getUserLatestOrder = async (req, res) => {
  try {
    const userId = req.body.userId;

      // Find the latest order for the user
      const latestOrder = await orderModel.findOne({ userId }).sort({ date: -1 });

      if (!latestOrder) {
          return res.status(404).json({ success: false, message: "No orders found for this user." });
      }

      res.json({ success: true, shippingAddress: latestOrder.shippingAddress });
  } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export {verifyRazorpay, placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus, getUserLatestOrder};