import Book from "../models/books.js";
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

class CartController {
    static addItemToCart = async (userId, bookId, quantity) => {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            console.log("Creating new cart for user");
            cart = await Cart.create({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += parseInt(quantity);
            console.log("Updated quantity for existing item");
        } else {
            cart.items.push({ bookId, quantity: parseInt(quantity) });
            console.log("Added new item to cart");
        }

        const savedCart = await cart.save();
        console.log("Cart saved:", savedCart);
        return savedCart;
    }

    static addToCart = async (req, res) => {
        const { bookId, quantity } = req.body;
        const userId = req.session.user._id;
        console.log("Adding to cart: User:", userId, "Book:", bookId, "Qty:", quantity);

        try {
            await CartController.addItemToCart(userId, bookId, quantity);
            res.redirect('/cart');
        } catch (error) {
            console.log("Error adding to cart:", error);
            res.redirect('/');
        }
    }

    static buyNow = async (req, res) => {
        const { bookId, quantity } = req.body;
        const userId = req.session.user._id;
        console.log("Buy Now: Adding to cart and checking out. User:", userId, "Book:", bookId, "Qty:", quantity);

        try {
            await CartController.addItemToCart(userId, bookId, quantity);
            res.redirect('/cart/checkout');
        } catch (error) {
            console.log("Error in buyNow:", error);
            res.redirect('/');
        }
    }

    static getCart = async (req, res) => {
        const userId = req.session.user._id;
        console.log("Fetching cart for user:", userId);
        try {
            const cart = await Cart.findOne({ userId }).populate('items.bookId');
            console.log("Cart retrieved:", cart);
            
            let totalPrice = 0;
            if (cart) {
                cart.items.forEach(item => {
                    if (item.bookId) {
                        totalPrice += item.quantity * item.bookId.price;
                    } else {
                        console.log("Item has no book details (populate failed?)", item);
                    }
                });
                console.log("Total Price:", totalPrice);
                res.render('cart', { cart: cart, totalPrice: totalPrice, title: 'Your Cart' });
            } else {
                console.log("No cart found for user");
                res.render('cart', { cart: { items: [] }, totalPrice: 0, title: 'Your Cart' });
            }
        } catch (error) {
            console.log("Error fetching cart:", error);
            res.redirect('/');
        }
    }

    static deleteItem = async (req, res) => {
        const { bookId } = req.body;
        const userId = req.session.user._id;
        try {
            const cart = await Cart.findOne({ userId });
            if (cart) {
                cart.items = cart.items.filter(item => item.bookId.toString() !== bookId);
                await cart.save();
            }
            res.redirect('/cart');
        } catch (error) {
            console.log(error);
            res.redirect('/cart');
        }
    }

    static checkout = async (req, res) => {
        const userId = req.session.user._id;
        try {
            const cart = await Cart.findOne({ userId }).populate('items.bookId');
            if (!cart || cart.items.length === 0) {
                return res.redirect('/cart');
            }

            let totalPrice = 0;
            let totalQuantity = 0;
            // Filter out invalid items (e.g. deleted books) and calculate total
            const validItems = cart.items.filter(item => item.bookId);
            
            validItems.forEach(item => {
                totalPrice += item.quantity * item.bookId.price;
                totalQuantity += item.quantity;
            });

            if (validItems.length === 0) {
                 return res.redirect('/cart');
            }

            const uid = uuidv4();
            const message = `total_amount=${totalPrice},transaction_uuid=${uid},product_code=EPAYTEST`;
            const hash = CryptoJS.HmacSHA256(message, process.env.ESEWASECRET);
            const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

            const success_url = `${req.protocol}://${req.get('host')}/cart/verify-esewa`;
            const failure_url = `${req.protocol}://${req.get('host')}/cart`;

            // Use the first book's image as placeholder, or a generic one
            const displayImage = validItems[validItems.length - 1].bookId.image;
            const displayTitle = `Cart Checkout (${totalQuantity} items)`;
            const displayDescription = `Order for ${totalQuantity} items. Total: Rs.${totalPrice}`;

            res.render("order", { 
                description: displayDescription, 
                image: displayImage, 
                id: 'cart_checkout', 
                title: displayTitle, 
                uid: uid, 
                price: totalPrice, 
                signature: hashInBase64,
                success_url: success_url,
                failure_url: failure_url
            });

        } catch (error) {
            console.log(error);
            res.redirect('/cart');
        }
    }

    static verifyEsewa = async (req, res) => {
        const data = req.query.data;
        const userId = req.session.user._id;

        try {
            if (!data) {
                console.log("No data received in Cart verifyEsewa");
                return res.redirect("/cart");
            }
            const decodedString = Buffer.from(data, 'base64').toString('utf-8');
            console.log("dec_string", decodedString);
            const decodedData = JSON.parse(decodedString);

            if (decodedData.status === "COMPLETE") {
                const message = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${decodedData.product_code},signed_field_names=${decodedData.signed_field_names}`;
                const hash = CryptoJS.HmacSHA256(message, process.env.ESEWASECRET);
                const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

                if (hashInBase64 !== decodedData.signature) {
                     throw "Hash value not matched";
                }

                // Retrieve Cart to create Order
                const cart = await Cart.findOne({ userId }).populate('items.bookId');
                if (!cart) throw "Cart not found during verification";

                 const orderItems = cart.items.map(item => {
                    if (item.bookId) {
                        return {
                            bookId: item.bookId._id,
                            quantity: item.quantity,
                            price: item.bookId.price
                        };
                    }
                    return null;
                }).filter(item => item !== null);

                await Order.create({
                    orderedBy: userId,
                    items: orderItems,
                    totalPrice: decodedData.total_amount,
                    status: 'completed'
                });

                // Clear Cart
                cart.items = [];
                await cart.save();

                // Decrement stock for purchased items
                for (const item of orderItems) {
                    await Book.findByIdAndUpdate(item.bookId, { $inc: { stock: -item.quantity } });
                }

                // res.redirect("/orders");
                res.render("payment_status", { status: 'success', title: 'Payment Success' });
            } else {
                res.render("payment_status", { status: 'failure', title: 'Payment Failed' });
            }
        } catch (error) {
            console.log("error occurred", error);
            res.render("payment_status", { status: 'failure', title: 'Payment Failed' });
        }
    }
}

export default CartController;
