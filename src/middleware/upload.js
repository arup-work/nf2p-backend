import multer from "multer";
import path from 'path';

// Storage: save files to disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/profiles/');
    },
    filename: (req, file, cb) => {
        // Unique name: userId-timestamp-random-original-ext
        const uniqueSuffix = `${Date.now()}-${Math.random(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${req.user._id}-${uniqueSuffix}${ext}`);
    }
})

// Only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase);
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images allowed: jpeg,jpg,png,gif'));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, //5 MB
    fileFilter
})

export default upload;