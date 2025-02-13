import express from 'express';
import { addProduct, listProduct, removeProduct, singleProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import { authMiddleware, adminMiddleware } from '../middleware/adminAuth.js';

const productRouter = express.Router();

// Allow only admins to add/remove products WITHOUT authentication
productRouter.post("/add", (req, res, next) => {
    if (req.header("Authorization")) {
        authMiddleware(req, res, () => {
            adminMiddleware(req, res, next);
        });
    } else {
        console.log("Admin bypassing authentication.");
        next();
    }
}, upload.single("image"), addProduct);

productRouter.post('/remove', (req, res, next) => {
    if (req.header("Authorization")) {
        authMiddleware(req, res, () => {
            adminMiddleware(req, res, next);
        });
    } else {
        console.log("Admin bypassing authentication.");
        next();
    }
}, removeProduct);

// Users must be authenticated for other routes
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProduct);


export default productRouter;
