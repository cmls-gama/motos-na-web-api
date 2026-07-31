const express = require('express');
const motorcycleController = require('../controllers/motorcycleController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);
router.get('/', motorcycleController.list);
router.get('/:id', motorcycleController.getById);
router.post('/', authorize('manager'), motorcycleController.create);
router.put('/:id', authorize('manager'), motorcycleController.update);
router.delete('/:id', authorize('manager'), motorcycleController.remove);

module.exports = router;
