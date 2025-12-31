import mongoose from 'mongoose';
import Cart from './models/cart.js';
import Book from './models/books.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/esewa')
    .then(async () => {
        console.log("Connected to DB");
        const carts = await Cart.find({});
        console.log("Found", carts.length, "carts");

        for (const cart of carts) {
            console.log("\nCart for User:", cart.userId);
            console.log("Items (Raw):", JSON.stringify(cart.items, null, 2));
            
            // Try explicit populate
            const populatedCart = await Cart.findById(cart._id).populate('items.bookId');
            console.log("Items (Populated):");
            populatedCart.items.forEach(item => {
                if (item.bookId) {
                    console.log(` - Book: ${item.bookId.title} (ID: ${item.bookId._id})`);
                } else {
                    console.log(` - FAILED TO POPULATE (BookID: ${item.bookId})`);
                    // Check if book exists
                    // valid if item.bookId is null? No, populated it should be object or null.
                    // If populate failed, item.bookId is null.
                    // But wait, if keys were just ID before populate:
                    // In populatedCart, if no match, it is null.
                }
            });
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
