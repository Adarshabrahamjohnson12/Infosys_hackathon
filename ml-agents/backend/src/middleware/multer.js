import multer from "multer";

const storage = multer.memoryStorage(); // Store in memory

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only image files are allowed."), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
