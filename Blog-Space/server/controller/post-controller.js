
import Post from '../model/post.js';


export const createPost = async (req, res) => {
    try {
        const { title, description, username, categories, picture } = req.body;

        const post = new Post({
            title,
            description,
            username,
            categories,
            picture,        // <-- directly save URL
            createdDate: new Date()
        });

        // Build full URL for the stored image (if any)
        const host = req.get('host'); // e.g., localhost:8000
        const protocol = req.protocol; // http or https

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const updatePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        if (!post) {
            response.status(404).json({ msg: 'Post not found' })
        }

        await Post.findByIdAndUpdate(request.params.id, { $set: request.body })

        response.status(200).json('post updated successfully');
    } catch (error) {
        response.status(500).json(error);
    }
}

export const deletePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        await post.delete()

        response.status(200).json('post deleted successfully');
    } catch (error) {
        response.status(500).json(error)
    }
}

// Get single post by id
export const getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ msg: 'Post not found' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
};


export const getAllPosts = async (request, response) => {
    let username = request.query.username;
    let category = request.query.category;
    let post;
    try {
        if (username)
            post = await Post.find({ username: username });
        else if (category)
            post = await Post.find({ categories: category });
        else
            post = await Post.find({});

        response.status(200).json(post);
    } catch (error) {
        response.status(500).json(error)
    }
}

export const toggleLike = async (req, res) => {
    try {
        const username = req.user.username;
        const postId = req.params.id;

        let post = await Post.findById(postId);
        if (!post) return res.status(404).json("Post not found");

        if (!post.likes) post.likes = [];

        let likedByUser = false;

        if (post.likes.includes(username)) {
            post.likes = post.likes.filter(u => u !== username);
        } else {
            post.likes.push(username);
            likedByUser = true;
        }

        await post.save();

        return res.status(200).json({
            _id: post._id,
            title: post.title,
            username: post.username,
            description: post.description,
            picture: post.picture,
            categories: post.categories,
            createdDate: post.createdDate,
            likes: post.likes,          // <-- IMPORTANT
            likesCount: post.likes.length,
            likedByUser                 // <-- IMPORTANT
        });

    } catch (error) {
        res.status(500).json(error);
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne(
            { username },
            { password: 0 } // exclude password
        );

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};
