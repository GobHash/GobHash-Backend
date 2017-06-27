import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import crypto from 'crypto';
import config from './config';

const myConfig = new AWS.Config({
  accessKeyId: config.s3_key,
  secretAccessKey: config.s3_secret,
  region: 'us-east-2',
  signatureVersion: 'v4'
});
const s3 = new AWS.S3(myConfig);

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'gobhash',
    ACL: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const extension = file.originalname.substring(file.originalname.lastIndexOf('.'));
      cb(null, `profile/${crypto.randomBytes(20).toString('hex')}${extension}`);
    }
  }),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That file type is not supported' }, false);
    }
  }
});
export default upload;
