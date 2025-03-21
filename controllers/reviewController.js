import mongoose from "mongoose";
import reviewModel from "../models/reviewModel.js";

// Add a review
const addReview = async (req, res) => {
    try {
      const { productId, userName, rating, comment } = req.body;
      //const { userName, rating, comment } = req.body;
  
    if (!productId || !userName || !rating || !comment) {
       return res.status(400).json({ message: "All fields are required!" });
       }

  
      const newReview = new reviewModel({
        productId,
        userName,
        rating,
        comment,
      });
  
      await newReview.save();
      res.status(201).json({ message: "Review added successfully!", review: newReview });
    } catch (error) {
      res.status(500).json({ message: "Error adding review", error: error.message });
    }
  };
  
  // Get reviews for a specific product
  const getReviewsByProduct = async (req, res) => {
    try {
      const { productId } = req.params;
  
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required!" });
      }
  
      const reviews = await reviewModel.find({ productId }).sort({ createdAt: -1 });
  
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
  };


  // Route to get all reviews (for admin panel)
const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
};
  
  
  // Delete a review (Optional, for admin panel)
  const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        console.log("Received reviewId:", reviewId); // Debugging

        // Ensure reviewId is valid
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: "Invalid review ID format!" });
        }

        // Check if the review exists before deleting
        const review = await reviewModel.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found!" });
        }

        await reviewModel.findByIdAndDelete(reviewId);
        res.json({ message: "Review deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting review", error: error.message });
    }
};



  export {addReview, getReviewsByProduct, getAllReviews, deleteReview};