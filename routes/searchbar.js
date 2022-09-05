const {Router} = require('express');
const searchbar = require('../controllers/searchbar.js')


const router = Router();

// router.post('/create', product.addProduct)
router.post('/search',searchbar.searchbar)

module.exports = router