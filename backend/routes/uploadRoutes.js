import path from 'path'
import express from 'express'
import multer from 'multer'
const uploadRouter = express.Router();

//Storage on server
const storage = multer.diskStorage({
    // Where we want to save it
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    // How we want our file name to be formatted
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    // Expression to what file type is allowed
    const fileTypes = /jpg|jpeg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimeType);
    if(extname && mimeType) {
        return cb(null, true);
    } else {
        cb("Images Only!");
    }
}

const upload = multer({
    storage,
});

uploadRouter.post('/', upload.single('image'), (req, res) => {
    res.send({
        message: 'Image Uploaded',
        image: `/${req.file.path}`
    });
});

export default uploadRouter