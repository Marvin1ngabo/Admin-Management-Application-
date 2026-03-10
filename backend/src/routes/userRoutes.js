const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/auth');
const checkDeviceVerification = require('../middlewares/deviceCheck');

const router = express.Router();

// Get all users
router.get('/', authenticate, authorize('ADMIN'), checkDeviceVerification, userController.getAllUsers);

// Get user by ID
router.get('/:id', authenticate, authorize('ADMIN'), checkDeviceVerification, userController.getUserById);

// Update user
router.patch('/:id', authenticate, authorize('ADMIN'), checkDeviceVerification, userController.updateUser);

// Delete user
router.delete('/:id', authenticate, authorize('ADMIN'), checkDeviceVerification, userController.deleteUser);

module.exports = router;
