import productModel from "../models/productModel.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";


// Set up multer for handling form-data
const storage = multer.memoryStorage(); // Store file in memory buffer
const upload = multer({ storage });

// Function to upload file from buffer correctly
function bufferToStream(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
}

// Modify the addProduct route to use multer middleware
const addProduct = async (req, res) => {
    try {
        const { title, price, category, highlights, benefits } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        const imageBuffer = req.file.buffer; // Get image buffer
        const imageUrl = await bufferToStream(imageBuffer); // Upload to Cloudinary

        // Save to MongoDB
        const productData = {
            title,
            price,
            image: [imageUrl], // Save the image URL
            category,
            highlights,
            benefits,
            date: new Date(),
        };

        console.log(productData);

        const product = new productModel(productData);
        await product.save();

        res.json({
            success: true,
            message: "Product added successfully",
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listProduct = async (req, res) => {

    try {
        const products = await productModel.find({});
        res.json({success: true , products})
    } catch (error) {
        console.error("Error list the product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//function for removing products
const removeProduct = async (req, res) => {

    try {

        await productModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "Product Removed"})

    } catch (error) {

        console.error("Error remove the product:", error);
        res.status(500).json({ success: false, message: error.message });

    }
};

//function for single products
const singleProduct = async (req, res) => {

    try {
        
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.json({success: true , product})

    } catch (error) {
        
        console.error("Error single product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addProduct, listProduct, removeProduct, singleProduct };
