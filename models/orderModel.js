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
        quantity: { type: Number, required: true, default: 1 },
        image: { type: Array, required: true },
        price: { type: Number, required: true }, // Single price field
        totalPrice: { type: Number, required: true }, // Separate total price
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["Razor Pay", "Stripe", "Cash on Delivery"],
      required: true,
    },
    paymentResult: {
      id: String, // Payment transaction ID (e.g., from Stripe/PayPal)
      status: String,
      update_time: String,
      email_address: String,
    },
    totalPrice: { type: Number, required: true, default: 0 }, // Total price of cart
    totalItems: { type: Number, required: true, default: 0 }, // Total count of items
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }    // Automatically adds createdAt & updatedAt timestamps
);

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
