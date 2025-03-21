import express from 'express';
import {addReview, getReviewsByProduct, getAllReviews, deleteReview} from '../controllers/reviewController.js';


const reviewRouter = express.Router();

// Route to add a review
reviewRouter.post("/add", addReview);

// Route to get reviews for a specific product
reviewRouter.get("/:productId", getReviewsByProduct);

//admin view product review
reviewRouter.get("/view", getAllReviews);

// Route to delete a review (Optional, for admin)
reviewRouter.delete("/:reviewId", deleteReview);

export default reviewRouter;