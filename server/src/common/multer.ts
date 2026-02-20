import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve(process.cwd(), 'uploads');
const profileDir = path.join(uploadDir, 'profile_images');
const recipeDir = path.join(uploadDir, 'recipe_images');

[uploadDir, profileDir, recipeDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'profile_image') {
            cb(null, profileDir);
        } else if (file.fieldname === 'recipe_image') {
            cb(null, recipeDir);
        } else {
            cb(null, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        const url = req.originalUrl;
        const urlParts = url.split('/');
        let id = '';

        if (url.includes('/recipes/')) {
            const recipeIndex = urlParts.indexOf('recipes');
            if (recipeIndex !== -1 && urlParts[recipeIndex + 1]) {
                id = urlParts[recipeIndex + 1];
            }
        } else if (url.includes('/users/')) {
            const userIndex = urlParts.indexOf('users');
            if (userIndex !== -1 && urlParts[userIndex + 1]) {
                id = urlParts[userIndex + 1];
            }
        }

        if (id && id.length > 5) {
            cb(null, id + path.extname(file.originalname));
        } else {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    }
});

export const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});