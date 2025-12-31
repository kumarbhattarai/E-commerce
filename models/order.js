import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema({
    orderedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    items: [{
        bookId: {
            type: Schema.Types.ObjectId,
            ref: "Book",
        },
        quantity: {
            type: Number,
        },
        price: {
            type: Number,
        }
    }],
    totalPrice: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order