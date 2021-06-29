import express from 'express'
import errorHandler from '../lib/error_handler.js'

const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => res.send())

module.exports = router
