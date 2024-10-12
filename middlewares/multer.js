import multer from 'multer';
import fs from 'fs';
import path from 'path';

// check if the uploads folder exists, if not, create one
const dir = path.join(_dirname, ('uploads'));
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, {recursive: true});
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb
    }
})

export default upload;