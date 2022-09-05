const {Testimoni} = require('../models')
const {Images} = require ('../models')
const sequelize = require('../config/dbQuery')
const {QueryTypes} = require('sequelize')
const query = require('../controllers/query')
const {uuid} = require('uuidv4')
const fs = require('fs')


class Controller {



    static async addtestimoni(req,res,next){
        const tx = await sequelize.transaction()
        try{
        let {title,description,name} = req.body

        if(!req.file){
            return res.status(500).json({message:"media Image needs to be uploaded"})
        }



        let id = uuid()
        let id_image = uuid()

        let TestimoniInput ={
            id : id,
            name:name,
            title:title,
            description:description,
        }
        let imageInput = {
            id : id,
            id_image: id_image,
            imagePath: req.file.path,
            imageName: req.file.filename,
            category: '04'
        }
        await Testimoni.create(TestimoniInput)
        await Images.create(imageInput)
        await tx.commit()
        return res.status(200).json({
            Testimoni:TestimoniInput,
            image: imageInput
        })

        }catch(err){
            await tx.rollback()
            next(err)
        }
    }

    static async Alltestimoni(req,res,next){
        const {page, size} = req.query
        const pageNum = Number(page)
        const pageSize = Number(size)
        try{

            let data = await sequelize.query(query.getTestimoni,{
                type:QueryTypes.SELECT,
                replacements: {pageNum, pageSize}
            })

            return res.status(200).json(data)

        }catch(err){
            next(err)
        }
    }

    static async testimoniById(req,res,next){
        let {id} = req.params
        try{
        const [Testimoni] = await Promise.all([
            sequelize.query(query.getTestimoniDetail, {
                 type: QueryTypes.SELECT,
                 replacements : {id}
            })
        ])
        return res.status(200).json(Testimoni)
            
        } catch (err){
            next(err)
        }
    }

    static async testimoniUpdate(req, res, next) {
        let id = req.body.id
        const tx = await sequelize.transaction()
        try{

            let updateInput = {
                title:req.body.title,
                description:req.body.description, 
            }

            if(!req.file){
                console.log('TRUE MASUK')

                await Testimoni.update(updateInput,{
                     where: {id},
                     returning: true
                 })
                 await tx.commit()
                 return res.status(200).json({message: updateInput})
            }

            let imageData = await sequelize.query(`
            select i.imagePath from Images i
            where i.id ='${id}'`,
            {type: QueryTypes.SELECT})


            await fs.unlinkSync(".\\" + imageData[0].imagePath)

            

            await Testimoni.update(updateInput,{
                where: {id},
                returning: true
            })
          
            let updateImage = {
                imagePath: req.file.path,
                imageName: req.file.filename
            }
    
            await Images.update(updateImage,{
                where: {id},
                returning: true
            })
            await tx.commit()
            return res.status(200).json({message:"updated succeed with image"})

            
           
        }catch(err){
            await tx.rollback()
            next(err)
        }
    }

    static async deleteTestimoni(req,res,next) {
        let {id} = req.body
        const tx = await sequelize.transaction()
        try{
            let image = await sequelize.query(query.getImageProd,{
                type: QueryTypes.SELECT,
                replacements : {id}
            })
            await Testimoni.destroy({where: {id}})
            await Images.destroy({where: {id}})
            await fs.unlinkSync(".\\"+ image[0].imagePath);
            await tx.commit()
            return res.status(200).json({message: 'Testimoni deleted'})
            
        }catch(err){
            await tx.rollback()
            next(err)
        }
    }

  
}

module.exports = Controller