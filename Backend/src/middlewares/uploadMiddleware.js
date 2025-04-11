const multer = require("multer");
const path = require("path");

// Set storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/projects");
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

// File filter for zip only
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".zip") {
        return cb(new Error("Only .zip files are allowed"), false);
    }
    cb(null, true);
};

// Max size = 10MB
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = upload;
