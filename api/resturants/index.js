const router = require('express').Router();
const { fetchResturants } = require('../../db')

router.get('/', async (req, res, next) => {
try {
    const resturants = await fetchResturants();
    res.status(200).send(resturants)
} catch (error) {
    next(error)
}
})

module.exports = router;