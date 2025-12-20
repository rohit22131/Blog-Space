import mongoose from 'mongoose';

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        default: null
    },
    username: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        default: ['All']  
    },
    createdDate: {
        type: Date
    },
    likes: {
    type: [String],   
    default: []
},
});


const post = mongoose.model('post', PostSchema);

export default post;