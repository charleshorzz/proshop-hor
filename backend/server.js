// Built in node modules on top
import path from "path";
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
// Called before other element
dotenv.config();
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Body-parser middleware (use built in express function)
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//Cookie-parser middleware, allow us to access req.cookie.jwt
app.use(cookieParser());

// Direct to productRoutes whenever hit /api/products
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use('/api/orders', orderRouter)
app.use('/api/upload', uploadRouter)

app.get('/api/config/paypal', (req, res) => res.send({
    clientId: process.env.PAYPAL_CLIENT_ID
}));

//Make upload folders static
const __dirname = path.resolve(); // Set __dirname to current directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    // any route that is not api will be redirected to index.html
    app.get('*', (req, res) => 
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API RUNNING...");
    });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${port} `)
})