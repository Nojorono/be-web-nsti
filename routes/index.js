const {Router} = require('express');
const {errorHandler} = require('../middlewares/errorHandler')
const router = Router();
const userRouter = require('./user')
const productRouter = require('./product')
const mediaRouter = require('./media')
const careerRouter = require('./career')
const search = require('./searchbar')
const testimoniRouter = require('./testimoni')

router.use('/user', userRouter)
router.use('/product', productRouter)
router.use('/media',mediaRouter)
router.use('/career',careerRouter)
router.use('/searchbar',search)
router.use('/testimoni',testimoniRouter)

router.use(errorHandler)



module.exports = router