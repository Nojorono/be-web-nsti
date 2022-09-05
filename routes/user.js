const userController = require('../controllers/User')
const router = require('express').Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/view',userController.viewUser)


module.exports = router