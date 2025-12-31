import mongoose from 'mongoose';
import Order from './models/order.js';
import User from './models/user.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/esewa')
    .then(async () => {
        console.log("Connected to DB");
        
        const orders = await Order.find({}).populate('orderedBy');
        console.log(`Found ${orders.length} total orders.`);
        
        orders.forEach(order => {
            console.log("Order ID:", order._id);
            console.log("Status:", order.status);
            console.log("Total Price:", order.totalPrice);
            console.log("Ordered By ID:", order.orderedBy ? order.orderedBy._id : "NULL");
            console.log("Ordered By Email:", order.orderedBy ? order.orderedBy.email : "UNKNOWN USER");
            console.log("Items:", JSON.stringify(order.items));
            console.log("---");
        });

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
