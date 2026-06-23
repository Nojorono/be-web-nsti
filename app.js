const express = require("express");
const { engine } = require("express-handlebars");
//const fileUpload = require('express-fileUpload')
const db = require("./config/dbQuery");
var multer = require("multer");
const path = require("path");
var fs = require("fs");

const app = express();

const productionHosts = new Set([
  "back-api.nikkisuper.my.id",
  "nikkisuper.my.id",
  "www.nikkisuper.my.id",
  "nikkisuper.co.id",
  "www.nikkisuper.co.id",
]);

function isLocalDevOrigin(origin) {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    const host = u.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") return false;
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isAllowedProductionOrigin(origin) {
  try {
    return productionHosts.has(new URL(origin).hostname);
  } catch {
    return false;
  }
}

function resolveCorsOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return "https://nikkisuper.co.id";
  if (isAllowedProductionOrigin(origin)) return origin;
  if (process.env.NODE_ENV !== "production" && isLocalDevOrigin(origin)) {
    return origin;
  }
  return null;
}

// Simplified CORS for reverse proxy setup - let Apache handle main CORS headers
app.use((req, res, next) => {
  // Only add CORS headers if they don't already exist (in case Apache didn't add them)
  if (!res.get("Access-Control-Allow-Origin")) {
    const allowedOrigin = resolveCorsOrigin(req);
    if (allowedOrigin) {
      res.header("Access-Control-Allow-Origin", allowedOrigin);
    }
    res.header("Vary", "Origin");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "origin, x-requested-with, content-type, access_token, authorization, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
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
  // Return JSON response for API root
  res.json({
    success: true,
    message: "Nikki Super Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      user: "/user",
      product: "/product",
      media: "/media",
      career: "/career",
      testimoni: "/testimoni",
      content: "/content",
      searchbar: "/searchbar"
    },
    timestamp: new Date().toISOString()
  });
});

const router = require("./routes");
app.use(router);

module.exports = app;

// const port = process.env.PORT || 3000 ;

// app.listen(port ,() => console.log(`Listening on port ${port}`))
