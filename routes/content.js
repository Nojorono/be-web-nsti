const { Router } = require('express');
const ContentController = require('../controllers/Content');
const { authentication } = require('../middlewares/authentication');

const router = Router();

// Public routes
router.get('/:type', ContentController.getContent);

// Protected routes (require authentication)
router.get('/', authentication, ContentController.getAllContents);
router.put('/:type', authentication, ContentController.upsertContent);
router.patch('/:type/status', authentication, ContentController.updateContentStatus);
router.delete('/:type', authentication, ContentController.deleteContent);

module.exports = router;
