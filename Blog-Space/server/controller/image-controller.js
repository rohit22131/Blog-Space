import grid from 'gridfs-stream';
import mongoose from 'mongoose';

const url = process.env.SERVER_URL || 'http://localhost:8000';

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs'  // should match GridFsStorage bucketName
    });
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection('fs');
});

// Upload image
export const uploadImage = (req, res) => {
    try {
        console.log("File received:", req.file);
        if (!req.file) {
            console.error("No file received from Multer!");
            return res.status(400).json("No file uploaded");
        }

        const imageUrl = `${url}/file/${req.file.filename}`;
        console.log("Image URL to send:", imageUrl);
        res.status(200).json(imageUrl);

    } catch (error) {
        console.error("Upload error:", error); // <-- logs exact error
        res.status(500).json({ msg: error.message });
    }
};


// Get image
export const getImage = async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        if (!file) return res.status(404).json("File not found");

        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(res);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
