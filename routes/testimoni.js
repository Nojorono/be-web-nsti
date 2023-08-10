const {Router} = require('express');
const testimoni = require('../controllers/testimoni')
const {upload} = require('../helpers/upload')
const authentication = require('../middlewares/jwt')
const router = Router();

// router.post('/create', testimoni.addProduct)
router.get('/readAll',testimoni.Alltestimoni)
router.get('/detail/:id',testimoni.testimoniById)
router.post('/create',
//authentication,
upload.single('sampleFile'),testimoni.addtestimoni)
router.patch('/edit',
//authentication,
upload.single('sampleFile'), testimoni.testimoniUpdate)
router.delete('/delete',
//authentication, 
testimoni.deleteTestimoni)


module.exports = router