var multer = require('multer');
const path = require('path')
const fs = require('fs')
const { v4: uuid } = require("uuid");

// Ensure image directory exists
const imageDir = path.join(__dirname, '..', 'image');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
  console.log('Created image directory:', imageDir);
}

var storage = multer.diskStorage({ 
  destination: function (req, file, callback) { 
    // Use absolute path to ensure consistency
    callback(null, imageDir);  
  },  
  filename: function (req, file, callback) {  
    if (!file) {
      return callback(new Error('File is not provided'));
    }
    const unixName = `${uuid()}${path.extname(file.originalname)}`;
    callback(null, unixName);  
  }  
});  

// File filter to accept only images
function fileFilter(req, file, cb) {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
}

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
}) 




module.exports = {upload: upload}