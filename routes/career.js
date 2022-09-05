const {Router} = require('express');
const career = require('../controllers/Career.js')
// const {upload} = require('../helpers/upload')
const authentication = require('../middlewares/jwt')

const router = Router();

// router.post('/create', product.addProduct)
router.get('/readAll',career.Allcareer)
router.get('/detail/:id',career.careerById)
router.post('/create',authentication,career.addcareer)
router.patch('/edit',authentication, career.careerUpdate)
router.delete('/delete',authentication, career.deletecareer)


module.exports = router