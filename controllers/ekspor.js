const sequelize = require('../config/dbQuery')
const {uuid} = require('uuidv4')
const {Images} = require ('../models')

class Controller {
    static async createEkspor(req,res,next){
        const tx = await sequelize.transaction()
        try{
            let {title,description} = req.body
            if(!req.file){
                return res.status(500).json({message:"media Image needs to be uploaded"})
            }

            let eskporInput ={
                id : id,
                title:title,
                description:description,
            }
            let imageInput = {
                id : id,
                imagePath: req.file.path,
                imageName: req.file.filename
            }
        }catch(err){

        }
    }
}

module.exports = Controller