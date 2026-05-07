const multer = require("multer");
const path = require("path");
const fs = require("fs");

// create uploads folder if not exists
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {

        const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// allow only images
const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;