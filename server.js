import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import adminRouter from './routes/adminRoute.js'
import cartRouter from './routes/cartRoute.js'
import { OpenAI } from "openai";
import orderRouter from './routes/orderRoute.js'
import reviewRouter from './routes/reviewRoutes.js'

//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors())

const prompt_base = `You are a skincare expert. Given the list of products below, analyze the user's question and recommend the most suitable products. For each product you recommend, explain briefly why it's suitable based on ingredients or skin benefits. Also include 1-2 personalized skincare tips relevant to the user's concern.

Products: Aloevera Gel, Anti Acne Gel, Basil Lemon Soap, Body Wash, Charcoal Soap, Chocolate Lip Scrub, Day Cream, Herbal Hair Oil, Lip Tint, Oats And Honey Soap, Pure Coconut Oil Soap, Red Wine Gel, Saffron Gel, Glutathione Serum, Glutathione Brightening Serum, Shea Butter Strawberry Lip Balm, Skin Brightening Cream, Sunscreen Lotion, Vanilla Lip Scrub, Wax Powder, Grape Fruit Shampoo, Strawberry Shampoo, Vanilla Lip Balm, Strawberry Lip Balm.

User Question: `;



//openAI for chatbot
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  app.post("/chat", async (req, res) => {  
    try {
      const { message } = req.body;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt_base + message }],
        max_tokens: 400,
      });
  
      res.json({ reply: response.choices[0].message.content });
    } catch (error) {
      console.error("Error Details:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Failed to get response from AI" });
    }
  });
  


/*----------------------------------------------------------------------------------------------- */


//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/admin', adminRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/review', reviewRouter)


app.get('/', (req, res) => {
    res.send('API working')
})

app.listen(port, () => console.log('Server started on PORT :' + port))

