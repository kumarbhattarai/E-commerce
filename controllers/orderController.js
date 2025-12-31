import Order from "../models/order.js";

class OrderController {
    static getUserOrders = async (req, res) => {
        const userId = req.session.user._id;
        console.log(`Getting orders for user: ${userId}`);
        try {
            const orders = await Order.find({ orderedBy: userId }).populate('items.bookId').sort({ _id: -1 });
            console.log(`Found ${orders.length} orders for user ${userId}`);
            res.render('user/orders', { orders: orders, title: 'My Orders' });
        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }
}

export default OrderController;
