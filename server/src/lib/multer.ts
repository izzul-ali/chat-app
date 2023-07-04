import multer from 'multer';

const destination = multer.diskStorage({
  destination: async (_, file, callback) => {
    if (file.mimetype.split('/')[0] === 'image') {
      callback(null, './resource/images/');
      return;
    }

    callback(new Error('Currently not supported this file type'), '');
  },

  filename(_, file, callback) {
    callback(null, file.originalname);
  },
});

const updload = multer({
  storage: destination,
  limits: {
    fileSize: 2000000, // max 2mb
  },
});

export default updload;
