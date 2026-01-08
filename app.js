const express = require("express");
const { engine } = require("express-handlebars");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/dbQuery");
var multer = require("multer");
const path = require("path");
var fs = require("fs");

const app = express();

// Configure CORS - Allow from environment variables or use defaults
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [
      'http://localhost:8002', // Nuxt frontend development
      'http://localhost:3000', // Alternative port
      'https://back-api.nikkisuper.my.id', // Production backend API
      'https://nikkisuper.my.id', // Production domain (fallback)
      'https://www.nikkisuper.my.id', // Production domain www (fallback)
      'https://nikkisuper.co.id', // Production domain co.id
      'https://www.nikkisuper.co.id' // Production domain www co.id
    ];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list or in development mode
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'development') {
      // In development, allow all origins
      callback(null, true);
    } else {
      // Log for debugging
      console.log('❌ CORS blocked origin:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 hours - cache preflight for 24 hours
};

// Log CORS configuration on startup
console.log('🌐 CORS Configuration:');
console.log('   Allowed Origins:', allowedOrigins);
console.log('   NODE_ENV:', process.env.NODE_ENV || 'not set');

// Apply CORS middleware FIRST, before any routes or other middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly (OPTIONS method) - must be before other routes
// This handles ALL OPTIONS requests (preflight) before routes are processed
app.options('*', (req, res) => {
  console.log('✈️  Preflight request:', req.method, req.url, 'Origin:', req.headers.origin);
  
  // Get origin from request
  const origin = req.headers.origin;
  
  // Check if origin is allowed
  if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
    // Set CORS headers manually for preflight
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(204).end();
  } else {
    console.log('❌ CORS preflight blocked for origin:', origin);
    res.status(403).end();
  }
});

// Log all requests for debugging (optional)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('✈️  OPTIONS request:', req.url, 'Origin:', req.headers.origin);
  }
  next();
});

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
