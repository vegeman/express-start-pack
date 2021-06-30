import express from 'express'
import apiV1 from '../controllers/ApiRoute1'

const router = express.Router()

router.use(apiV1)
// router.use('/v2', apiV2)

/* GET home page. */
router.get('/', (req, res) => res.send())

module.exports = router
