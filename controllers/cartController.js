import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js"; 
import userModel from "../models/userModel.js";



// Add product to cart 
const addToCart = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Debugging log

    let { email, name, userId, productId, title, price, image, quantity } = req.body;

    // Fetch user name and email from the database if missing
    if (!name || !email) {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      name = user.name;
      email = user.email;
    }

    // Fetch product details if missing
    if (!title || !price) {
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      title = product.title;
      price = product.price;
      image = product.image;
    }

    let userCart = await cartModel.findOne({ userId });
    console.log("Existing Cart Found:", userCart);

    if (!userCart) {
      userCart = new cartModel({
        userId,
        name, //  Assign name
        email, // Assign email
        items: [{ productId, title, price, image, quantity: quantity || 1, totalPrice: price * (quantity || 1) }],
        totalPrice: price * (quantity || 1),
        totalItems: quantity || 1
      });
    } else {
      // Ensure name and email are updated for existing cart
      userCart.name = name;
      userCart.email = email;

      const existingItem = userCart.items.find((item) => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity || 1;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        userCart.items.push({ productId, title, price, image, quantity: quantity || 1, totalPrice: price * (quantity || 1) });
      }
      userCart.totalPrice = userCart.items.reduce((sum, item) => sum + item.totalPrice, 0);
      userCart.totalItems = userCart.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    await userCart.save();
    console.log("Cart saved successfully:", userCart);
    
    res.json({ success: true, message: "Product added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update cart quantity
const updateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const userCart = await cartModel.findOne({ userId });

    if (!userCart) {
      return res.json({ success: false, message: "Cart not found" });
    }

    const item = userCart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.json({ success: false, message: "Product not found in cart" });
    }

    if (quantity <= 0) {
      userCart.items = userCart.items.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await userCart.save();
    res.json({ success: true, message: "Cart updated", cart: userCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user cart data
const getUserCart = async (req, res) => { 
  try {
    const { userId } = req.body;
    const userCart = await cartModel.findOne({ userId });

    if (!userCart) {
      return res.json({ success: true, cartData: [] });  // Return empty array if no cart exists
    }

    let cartData = userCart.cartData || [];  // Ensure cartData is always an array

    res.json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//deleting the cart on logout
const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Remove user's cart from the database
    await cartModel.findOneAndDelete({ userId });

    res.json({ success: true, message: "User logged out and cart removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart, logoutUser };
