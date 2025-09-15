const express = require("express");
const { engine } = require("express-handlebars");
const cors = require("cors");
//const fileUpload = require('express-fileUpload')
const db = require("./config/dbQuery");
var multer = require("multer");
const path = require("path");
// var upload = multer();
var fs = require("fs");
// const testDB = require('./config/dbQuery')

const app = express();

// Configure CORS with specific options to avoid duplicate headers
const corsOptions = {
  origin: ['https://nikkisuper.co.id', 'http://localhost:8002', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['origin', 'x-requested-with', 'content-type', 'access_token', 'authorization', 'Authorization']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
 }));
 
app.use(bodyParser.json());

// for parsing multipart/form-data
// app.use(upload.array());
app.use(express.static("image"));
app.use("/image", express.static("image"));

// var upload = multer({ dest: './image'});
// var type = upload.single('sampleFile');
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

var storage =   multer.diskStorage({ 
    
    destination: function (req, file, callback) { 
        console.log(req,"INI DESTINATION")  
      callback(null, './image');  
    },  
    filename: function (req, file, callback) {  
        console.log(req,"INI FILE NAME")  
      callback(null,Date.now() + path.extname(file.originalname));  
    }  
  });  

  var upload = multer({ storage : storage}).single('sampleFile');  

  app.post('/',(req,res) =>{  
    console.log(req.body,'MASUK')
    upload(req,res,function(err) {
        console.log(req.body,'MASUK UPLOAD')  
        console.log(req.file,'MASUK UPLOAD')  
        if(err) {  
            return res.end("Error uploading file.");  
        }  
        res.end("File is uploaded successfully!");  
    });  
});  

//templating engine

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("index");
});

const router = require("./routes");
app.use(router);

module.exports = app;

// const port = process.env.PORT || 3000 ;

// app.listen(port ,() => console.log(`Listening on port ${port}`))
