import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema, 'review');

export default reviewModel;