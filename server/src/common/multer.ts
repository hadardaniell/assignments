import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // כאן נשמרים הקבצים
    },
    filename: (req, file, cb) => {
        // יוצר שם ייחודי: timestamp + מספר רנדומלי + סיומת מקורית
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({ storage });