function errorHandler (err,req,res,next){
    if(err) {
        console.log(err,'INI ERROR HANDLER')
        
        // Ensure CORS headers are set even on errors
        const origin = req.headers.origin;
        const cors = require('cors');
        const allowedOrigins = process.env.FRONTEND_URL 
          ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
          : [
              'http://localhost:8002',
              'http://localhost:3000',
              'https://back-api.nikkisuper.my.id',
              'https://nikkisuper.my.id',
              'https://www.nikkisuper.my.id',
              'https://nikkisuper.co.id',
              'https://www.nikkisuper.co.id'
            ];
        
        // Set CORS headers for error responses
        if (origin && (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development')) {
          res.setHeader('Access-Control-Allow-Origin', origin);
          res.setHeader('Access-Control-Allow-Credentials', 'true');
        }
        
        switch(err.name){
            case 'SequelizeValidationError' :
            let output = []
            for(let i = 0; i < err.errors.length; i ++){
                output.push(err.errors[i].message)
                }
                res.status(400).json({ message : output})
                break;
            case 'SequelizeUniqueConstraintError' :
                res.status(400).json({ message: err.errors[0].message})
                break;
            case 'Not an Admin' : 
                res.status(401).json({message: 'Unauthorized'})
                break;
            case 'invalid Email/Password' :
                res.status(400).json({message: 'invalid Email/Password'})
                break;
            case 'Not Found' :
                res.status(404).json({message: 'Not Found'})
                break;
            default:
                // Handle CORS errors specially
                if (err.message && err.message.includes('CORS')) {
                  console.log('🚫 CORS Error:', err.message);
                  res.status(403).json({ message: 'CORS policy violation', error: err.message });
                } else {
                  res.status(500).json({ message: 'Internal Server Error',
              message2: err})
                }
                break;
        }   
    }
}
module.exports = {errorHandler}