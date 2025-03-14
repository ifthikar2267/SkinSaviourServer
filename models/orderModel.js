import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: { type: String, required: true },
        image: { type: Array, required: true },
        price: {
          baseRate: { type: Number, required: true }, // Single price field
          total: { type: Number, required: true }, // Separate total price
          quantity: { type: Number, required: true} 
        }
      },
    ],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["Razorpay", "Cash on Delivery"],
      required: true,
    },
    paymentResult: {
      id: String, // Payment transaction ID (e.g., from Stripe/PayPal)
      status: String,
      update_time: String,
      email_address: String,
    },
    totals: {
      total: { type: Number, required: true}, // Total price of cart
      quantity: { type: Number, required: true}, // Total count of items
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    orderStatus: {
      type: String,
      enum: ["Confirmed","Pending", "Packing", "Shipped", "Delivered", "Cancelled"],
      default: "Confirmed",
    },
    date: { type: Date, default: Date.now },

    razorpay_order_id: { type: String, unique: false, sparse: true },

  },
  { timestamps: true }    // Automatically adds createdAt & updatedAt timestamps
);

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema, "order");

export default orderModel;
