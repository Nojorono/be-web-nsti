var multer = require('multer');
const path = require('path')
const image = require('../models/images');
// const image1 = require('../../client/image')




var storage =   multer.diskStorage({ 
    
    destination: function (req, file, callback ) { 
      callback(null, './image');  
    },  
    filename: function (req, file, callback) {  
        console.log(req,"INI FILE NAME") 
        console.log(file,"INI FILENYA") 
        if(!file){
          res.status(500).json({message:"FILE IS NOT THERE"})
        }  
      callback(null,
        Date.now() + path.extname(file.originalname))  ;  
    }  
  });  

  function fileFilter (req, file, cb) {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
  
    // To reject this file pass `false`, like so:
    cb(null, false)
  
    // To accept the file pass `true`, like so:
    cb(null, true)
  
    // You can always pass an error if something goes wrong:
    cb(new Error('I don\'t have a clue!'))
  
  }

// const upload = multer({ storage : storage}).single('sampleFile');  

const upload = multer({ storage : storage}) 




module.exports = {upload: upload}