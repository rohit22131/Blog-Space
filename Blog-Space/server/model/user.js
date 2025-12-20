import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    followers: {
        type: [String],
        default: []
    },
    following: {
        type: [String],
        default: []
    }
});

const user = mongoose.model('user', userSchema);

export default user;