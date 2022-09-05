function errorHandler (err,req,res,next){
    if(err) {
        console.log(err,'INI ERROR HANDLER')
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
                res.status(500).json({ message: 'Internal Server Error',
            message2: err})
                break;
        }   
    }
}
module.exports = {errorHandler}