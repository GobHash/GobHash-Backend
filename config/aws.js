import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import config from './config';

const myConfig = new AWS.Config({
  accessKeyId: config.s3_key,
  secretAccessKey: config.s3_secret,
  region: 'us-west-2'
});
const s3 = new AWS.S3(myConfig);

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'some-bucket',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString());
    }
  })
});

export default upload;
