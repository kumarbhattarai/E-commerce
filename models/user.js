import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
    },

    email: {
        type: String,
        unique: true,
        trim: true,
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },


    password: {
        type: String,
    },
});

const User = mongoose.model('User', userSchema);

export default User