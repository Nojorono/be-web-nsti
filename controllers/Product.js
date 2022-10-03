const {Product} = require('../models')
const {Images} = require ('../models')
const sequelize = require('../config/dbQuery')
const {QueryTypes} = require('sequelize')
const query = require('../controllers/query')
const {uuid} = require('uuidv4')
const fs = require('fs')


class Controller {

    static async addProduct(req,res,next){
        console.log(req.files, 'INI REQ FILE')

        // console.log(req, 'INI REQ DOANG')
        const tx = await sequelize.transaction()
        try{
        let {title,description} = req.body

        console.log(req.files,'INI FILE')
        if(!req.files){
            return res.status(500).json({message:"Product Image needs to be uploaded"})
        }


        let id = uuid()
        let id_image1 = uuid()
        let id_image2 = uuid()

        let productInput ={
            id : id,
            title:title,
            description:description,
        }

        let imageProduct = {
            id: id,
            id_image: id_image1,
            imagePath: req.files.sampleFile1[0].path,
            imageName: req.files.sampleFile1[0].filename,
            category: "01"
        }

        let imageIklan = {
            id: id,
            id_image: id_image2,
            imagePath: req.files.sampleFile2[0].path,
            imageName: req.files.sampleFile2[0].filename,
            category: "02"
        }

        console.log(imageIklan,'INI IMAGE IKLAN')
        await Product.create(productInput)
        await Images.create(imageProduct)
        await Images.create(imageIklan)

        await tx.commit()

        return res.status(200).json({
            product:productInput,
            imageProduct: imageProduct,
            imageIklan: imageIklan,
        })

        }catch(err){
            await tx.rollback()
            next(err)
        }
    }

    static async AllProduct(req,res,next){
        
        try{

          

            let data = await sequelize.query(query.getProd,{type:QueryTypes.SELECT})


            return res.status(200).json(data)

        }catch(err){
            next(err)
        }
    }

    static async ProductById(req,res,next){
        let {id} = req.params
        try{
        const [Product,Images] = await Promise.all([
            sequelize.query(query.getProducts, {
                 type: QueryTypes.SELECT,
                 replacements : {id}
            }),
            sequelize.query(query.getImages, {
                type: QueryTypes.SELECT,
                replacements : {id}
            })
        ])

      

        let result = Product[0].images = Images

        console.log(Product,'INI PRODUCT')
   
        


        return res.status(200).json(result)
            
        } catch (err){
            next(err)
        }
    }

    static async ProductUpdate(req, res, next) {
        let id = req.body.id
        const tx = await sequelize.transaction()
        try{

            let updateInput = {
                title:req.body.title,
                description:req.body.description, 
            }



            console.log(req.files,'INI IMAGE FILES')
            
            if(!req.files.sampleFile1 || !req.files.sampleFile2){
                console.log('TRUE MASUK')
                
                await Product.update(updateInput,{
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
            
            console.log(imageData[0].imagePath,"INI IMAGE ATA")
            
            
            for(let i = 0 ; i < imageData.length; i ++){
                console.log(".\\"+ imageData[i].imagePath,`INI DIRNAME`)
                await fs.unlinkSync(".\\" + imageData[i].imagePath)
            }
            
            // return res.status(200).json(req.files)
            // process.exit()
            

            await Product.update(updateInput,{
                where: {id},
                returning: true
            })
         
            let updateImageProduct = {
                imagePath: req.files.sampleFile1[0].path,
                imageName: req.files.sampleFile1[0].filename
            }

            let updateImageIklan = {
                imagePath: req.files.sampleFile2[0].path,
                imageName: req.files.sampleFile2[0].filename
            }
    
            await Images.update(updateImageProduct,{
                where: {
                    id : id,
                    category: '01'
                },
                returning: true
            })
            await Images.update(updateImageIklan,{
                where: {
                    id : id,
                    category: '02'
                },
                returning: true
            })
            await tx.commit()
            return res.status(200).json(
             {message:"updated succeed with image",
              imageProduct: updateImageProduct,
              updateImageIklan: updateImageIklan
             })

            
           
        }catch(err){
            await tx.rollback()
            next(err)
        }
    }

    static async deleteProduct(req,res,next) {
        let {id} = req.body
        console.log(req.body,'MASUK DELETE')
        const tx = await sequelize.transaction()
        try{

            let image = await sequelize.query(query.getImageProd,{
                type: QueryTypes.SELECT,
                replacements : {id}
            })

            for(let i = 0 ; i<image.length ; i++){
                await fs.unlinkSync(image[i].imagePath);
            }
           
            await Product.destroy({where: {id}})
            await Images.destroy({where: {id}})
            await tx.commit()
            return res.status(200).json({message: 'Product deleted'})
            
        }catch(err){
            await tx.rollback()
            next(err)
        }
    }

  
}

module.exports = Controller