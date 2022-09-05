const bcrypt = require('bcryptjs')
const fileUpload = require('express-fileupload')
const helpers = {

    uploadFile: (req,res) => {
        let sampleFile ;
        let uploadPath ;

        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json('No Files Uploaded')
        }

        sampleFile = req.sampleFile;
        

    },

    hashPassword : password => {
        return bcrypt.hashSync(password,10)
    },

    comparePassword : (password,hashPassword) => {
        return bcrypt.compareSync(password,hashPassword)
    }


}

module.exports = helpers