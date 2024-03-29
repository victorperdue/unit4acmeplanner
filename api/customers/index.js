const router = require('express').Router();
const { fetchCustomers } = require('../../db')

router.get('/', async (req, res, next) => {
try {
    const customers = await fetchCustomers();
    res.status(200).send(customers)
} catch (error) {
    next(error)
}
})

module.exports = router;