// API NOTIFICATION MESSAGES
export const API_NOTIFICATION_MESSAGES = {
    loading: {
        title: "Loading...",
        message: "Data is being loaded. Please wait"
    },
    success: {
        title: "Success",
        message: "Data successfully loaded"
    },
    requestFailure: {
        title: "Error!",
        message: "An error occur while parsing request data"
    },
    responseFailure: {
        title: "Error!",
        message: "An error occur while fetching response from server. Please try again"
    },
    networkError: {
        title: "Error!",
        message: "Unable to connect to the server. Please check internet connectivity and try again."
    }
}

// API SERVICE URL
// SAMPLE REQUEST
// NEED SERVICE CALL: { url: "/", method: "POST/GET/PUT/DELETE" }
export const SERVICE_URLS = {
    userLogin: { url: '/login', method: 'POST' },
    userSignup: { url: '/signup', method: 'POST' },
    logoutUser: { url: '/logout', method: 'POST' },

    getAllPosts: { url: '/posts', method: 'GET', params: true },
    getUserProfile: { url: "/user/", method: "GET", path: true },
    updateUserProfile: { url: '/user/update', method: 'PUT' },

    uploadFile: { url: '/file/upload', method: 'POST' },
    createPost: { url: '/create', method: 'POST' },

    deletePost: { url: '/delete/', method: 'DELETE', path: true },
    getPostById: { url: '/post/', method: 'GET', path: true },

    newComment: { url: '/comment/new', method: 'POST' },

    getAllComments: { url: '/comments/', method: 'GET', path: true },

    deleteComment: { url: '/comment/delete/', method: 'DELETE', path: true },

    updatePost: { url: '/update/', method: 'PUT', path: true },

    checkAuth: { url: '/check', method: 'GET' },

    toggleLike: { url: '/post/like/', method: 'PUT', path: true },
};