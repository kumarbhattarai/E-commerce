import Book from "../models/books.js"
import dotenv from "dotenv"
dotenv.config()

class BookController {
    static getDetails = async (req, res) => {
        const id = req.params.id;
        try {
            const book = await Book.findById(id);
            res.render("book/details", { title: book.title, book: book, errors: [] });
        } catch (error) {
            console.log(error);
            res.redirect("/");
        }
    }

}

export default BookController