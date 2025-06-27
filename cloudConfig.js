const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Fix the typos in this file:
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET // ← Was "api_secert"
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'airbnb_DEV',
        allowedFormats: ["png", "jpg", "jpeg"], // ← Was "allweredFormats"
    },
});
module.exports = {
    cloudinary,
    storage
};