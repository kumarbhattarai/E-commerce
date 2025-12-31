import Book from "../models/books.js"

class HomeController {
    static home = async (req, res) => {
        console.log("user====", req.session.user)
        try {
            let query = {};
            if (req.query.category) {
                query.category = { $regex: req.query.category, $options: 'i' };
            }
            const books = await Book.find(query)
            console.log("books", books)
            res.render('home', { errors: [], title: 'home', books: books })
        } catch (error) {
            res.redirect("/")
        }
    }

}

export default HomeController