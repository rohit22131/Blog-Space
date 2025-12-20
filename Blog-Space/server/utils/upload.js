import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const storage = new GridFsStorage({
    url: process.env.STORAGE_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpg", "image/jpeg"];
        if (!match.includes(file.mimetype)) {
            throw new Error("Only .png, .jpg, .jpeg files are allowed!");
        }
        return {
            bucketName: 'fs',
            filename: `${Date.now()}-blog-${file.originalname}`
        };
    }
});

export default multer({ storage });
