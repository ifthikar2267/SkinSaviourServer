import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory for direct upload

const upload = multer({ storage });

export default upload;
