import Book from "../models/books.js";
import Order from "../models/order.js";

class AdminController {
    static dashboard = async (req, res) => {
        try {
            const books = await Book.find({});
            res.render('admin/dashboard', { books: books, title: 'Admin Dashboard' });
        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }

    static getAddBook = (req, res) => {
        res.render('admin/edit-book', { title: 'Add Book', editing: false, book: {} });
    }

    static postAddBook = async (req, res) => {
        const { title, description, price, image, author, category, stock } = req.body;
        try {
            await Book.create({ title, description, price, image, author, category, stock });
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.log(error);
            res.redirect('/admin/add-book');
        }
    }

    static getEditBook = async (req, res) => {
        const editMode = req.query.edit;
        if (!editMode) {
            return res.redirect('/admin/dashboard');
        }
        const prodId = req.params.id;
        try {
            const book = await Book.findById(prodId);
            if (!book) {
                return res.redirect('/admin/dashboard');
            }
            res.render('admin/edit-book', {
                title: 'Edit Book',
                editing: editMode,
                book: book
            });
        } catch (error) {
            console.log(error);
            res.redirect('/admin/dashboard');
        }
    }

    static postEditBook = async (req, res) => {
        const prodId = req.body.id;
        const { title, description, price, image, author, category, stock } = req.body;
        try {
            await Book.findByIdAndUpdate(prodId, { title, description, price, image, author, category, stock });
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.log(error);
            res.redirect('/admin/dashboard');
        }
    }

    static deleteBook = async (req, res) => {
        const prodId = req.body.id; // Or req.params.id depending on route
        try {
            await Book.findByIdAndDelete(prodId);
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.log(error);
            res.redirect('/admin/dashboard');
        }
    }

    static getOrders = async (req, res) => {
        try {
            const orders = await Order.find({}).populate('orderedBy', 'email').populate('items.bookId');
            res.render('admin/orders', { orders: orders, title: 'Admin Orders' });
        } catch (error) {
            console.log(error);
            res.redirect('/admin/dashboard');
        }
    }

    static deleteOrder = async (req, res) => {
        const { orderId } = req.body;
        try {
            await Order.findByIdAndDelete(orderId);
            res.redirect("/admin/orders");
        } catch (error) {
            console.log(error);
            res.redirect("/admin/orders");
        }
    }
}

export default AdminController;
