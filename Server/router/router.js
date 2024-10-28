const express = require('express');
const router = express.Router();
const TripController = require('../controllers/tripController');
const UserController = require('../controllers/userControllers');
const authentication = require('../middleware/isAuthenticate');
const { isAuthorized, isAuthorizedAdmin } = require('../middleware/isAuthorization');

// Auth Routes
router.post('/register',authentication, isAuthorizedAdmin, UserController.register);
router.post('/login', UserController.login);

// Public Routes
router.get('/trips', TripController.getPublicTrips);
router.get('/trips/:id', TripController.getPublicTripById);

// User Routes (Authenticated)
router.use(authentication);
router.post('/trips', TripController.createCMSTrip);
router.put('/trips/:id', isAuthorized, TripController.updateCMSTrip);
router.get('/trips', TripController.getCMSTrips);
router.get('/trips/:id', TripController.getCMSTripById);
router.delete('/trips/:id', isAuthorizedAdmin, TripController.deleteCMSTrip);

module.exports = router;
