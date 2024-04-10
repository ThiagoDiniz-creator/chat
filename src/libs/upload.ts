import multer from "multer";

const storage = multer.memoryStorage(); // You can also use disk storage if you want to save files to disk
const upload = multer({ storage: storage });

export default upload;
