const query = require('./query')
const sequelize = require('../config/dbQuery')
const {QueryTypes} = require('sequelize')
// const query = require('../controllers/query')

class Controller {

    static async searchbar (req,res,next) {
        const {text} = req.body
        console.log('masuk')
        try{

            let str = `%${text}%`
            let pageSize = Number(req.body.limit)
            
    
            const [media,product] = await Promise.all([
                sequelize.query(query.ilikeMedia,{
                    type: QueryTypes.SELECT,
                    replacements : {str,pageSize}
                }),
                // sequelize.query(query.ilikeProduct,{
                //     type: QueryTypes.SELECT,
                //     replacements : {str,pageSize}
                // }),
            ])

            // const newArr = product.map(v => ({...v, category: 'product'}))
            const newArr1 = media.map(v => ({...v, category: 'media'}))
            // const arr3 = [...newArr,...newArr1]
            const arr3 = [...newArr1]

            
            return res.status(200).json(arr3)


        } catch(err){
            next(err)
        }
    }
}

module.exports = Controller