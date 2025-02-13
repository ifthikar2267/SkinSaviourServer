import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: {type: String, required: true},
    email: {type: String, required: true},
    items: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', 
                required: true 
            },
            title: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
            image: {type: Array , required: true},
            price: { type: Number, required: true }, // Single price field
            totalPrice: { type: Number, required: true } // Separate total price
        }
    ],
    totalPrice: { type: Number, required: true, default: 0 }, // Total price of cart
    totalItems: { type: Number, required: true, default: 0 } // Total count of items
});


const cartModel = mongoose.models.cart || mongoose.model('cart', cartSchema, 'cart');


export default cartModel;