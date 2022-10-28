import express from 'express'
import resFormat from '../lib/resFormat'
import errorHandler from '../lib/errorHandler'
import user from '../model/user'
const router = express.Router()

router.post('/signin', errorHandler((req, res, next) => {
  /*
    #swagger.tags = ['User']
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.summary = 'Endpoint to sign in a specific user'
    #swagger.description = ''
    #swagger.parameters['payload'] = {
      in: 'body',
      description: 'User information.',
      required: true,
      schema: {
        user: 'name'
      }
    }
  */
  res.status(201).json({
    data: [],
    message: 'Authentication successed',
  })
}))

router.get('/users/:id', errorHandler(async(req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Endpoint to get a specific user.'
    #swagger.description = ''
    #swagger.parameters['condition'] = {
      in: 'query',
      description: '',
      required: false
    }
  */
  await user.get(req.params.id)
    .then(result => {
      if (result.status) {
        return res.status(200).send(resFormat.return(result))
      } else {
        res.status(`${result.code}`.slice(0, 3) * 1).send(resFormat.return(result.message, result.code))
      }
    })
    .catch(err => {
      console.error(err)
      res.status(400).send(resFormat.return('Bad Request', 400))
    })
}))

module.exports = router
