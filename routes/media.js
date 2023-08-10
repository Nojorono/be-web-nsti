const {Router} = require('express');
const media = require('../controllers/Media')
const {upload} = require('../helpers/upload')
const authentication = require('../middlewares/jwt')
const router = Router();

// router.post('/create', product.addProduct)
router.get('/readAll',media.Allmedia)
router.get('/detail/:id',media.mediaById)
router.post('/create',
//authentication,
upload.single('sampleFile'),media.addmedia)
router.patch('/edit',
//authentication,
upload.single('sampleFile'), media.mediaUpdate)
router.delete('/delete',
//authentication,
media.deletemedia)


module.exports = router