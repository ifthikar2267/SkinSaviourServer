import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {type: String , required: true},
    price: {type: Number , required: true},
    image: {type: Array , required: true},
    category: {type: String , required: true},
    highlights: {type: String , required: true},
    benefits: {type: String , required: true},
    date: {type: Number , required: true}

})

const productModel = mongoose.models.product || mongoose.model("product",productSchema,"product");

export default productModel;