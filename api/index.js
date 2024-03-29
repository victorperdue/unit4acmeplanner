const router = require('express').Router();


router.use('/resturants', require('./resturants'));
router.use('/customers', require('./customers'));
router.use('/reservations', require('./reservations'));

module.exports = router;