function errorHandler (err,req,res,next){
    if(err) {
        console.log(err,'INI ERROR HANDLER')
        
        // Ensure CORS headers are set even on errors
        const origin = req.headers.origin;
        const productionHosts = new Set([
          'back-api.nikkisuper.my.id',
          'nikkisuper.my.id',
          'www.nikkisuper.my.id',
          'nikkisuper.co.id',
          'www.nikkisuper.co.id',
        ]);
        const extraOrigins = process.env.FRONTEND_URL
          ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
          : [];
        const isAllowedOrigin = (value) => {
          if (!value) return false;
          if (extraOrigins.includes(value)) return true;
          if (process.env.NODE_ENV === 'development') return true;
          try {
            return productionHosts.has(new URL(value).hostname);
          } catch {
            return false;
          }
        };

        // Set CORS headers for error responses
        if (origin && isAllowedOrigin(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
          res.setHeader('Access-Control-Allow-Credentials', 'true');
        }

        if (err.message === 'Only image files are allowed!') {
          return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan.' });
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
            case 'MulterError' :
                if (err.code === 'LIMIT_FILE_SIZE') {
                  return res.status(413).json({
                    message: 'Ukuran file terlalu besar. Maksimal 10 MB per file.',
                  });
                }
                return res.status(400).json({
                  message: `Upload gagal: ${err.message}`,
                });
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