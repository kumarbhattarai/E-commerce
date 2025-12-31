import mongoose from 'mongoose';
const { Schema } = mongoose;

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        bookId: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
