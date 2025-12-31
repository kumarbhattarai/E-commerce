import mongoose from 'mongoose';
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
    },

    description: {
        type: String,
        trim: true,
    },


    price: {
        type: String,
    },

    image: {
        type: String,
    },
    author: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
    },
    stock: {
        type: Number,
        default: 0
    },
});

const Book = mongoose.model('Book', bookSchema);

export default Book