const {Router} = require('express');
const product = require('../controllers/Product')
const {upload} = require('../helpers/upload')
const authentication = require('../middlewares/jwt')
const router = Router();

// router.post('/create', product.addProduct)
router.get('/readAll',product.AllProduct)
router.get('/detail/:id',product.ProductById)
router.post('/create',
//authentication,
upload.fields([{name:'sampleFile1'},{name:'sampleFile2'}]),product.addProduct)
router.patch('/edit',
//authentication,
upload.fields([{name:'sampleFile1'},{name:'sampleFile2'}]), product.ProductUpdate)
router.delete('/delete',
//authentication, 
product.deleteProduct)


module.exports = router