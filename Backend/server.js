const express=require('express');
const app=express();
require("dotenv").config();
const userRoute=require('./routes/authRoute');
const preferenceRoute=require('./routes/preferenceRoute');
const transactionRoutes=require('./routes/transactionRoute');
const categoryRoute=require('./routes/categoryRoute');
const budgetRoute = require('./routes/budgetRoute');
const analyticsRoute = require("./routes/analyticsRoute");
const predictionRoute = require("./routes/predictionRoute");

const mongoose = require("mongoose");
const cors = require("cors");


//middleware and connections
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));


//Routes
app.use('/api/user',userRoute);
app.use('/api/user/onboard',preferenceRoute);
app.use('/api/categories',categoryRoute)
app.use("/api/transactions", transactionRoutes)
app.use('/api/budget', budgetRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/prediction", predictionRoute);



app.listen(process.env.PORT,()=>{
    console.log("App is listing at port "+process.env.PORT)
})