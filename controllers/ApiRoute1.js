import express from 'express'
import auth from '../lib/auth'
import resFormat from '../lib/resFormat'
import errorHandler from '../lib/errorHandler'
import user from '../model/user'
const router = express.Router()

router.post('/signin', errorHandler((req, res, next) => {
  /*
    #swagger.tags = ['User']
    #swagger.description = 'Endpoint to sign in a specific user'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'User information.',
      required: true,
      schema: {
        user: 'name'
      }
    }
    #swagger.security = [{
      "apiKeyAuth": []
    }]
  */
  res.status(201).json({
    data: [],
    message: 'Authentication successed'
  })
}))

router.get('/users/:id', errorHandler(async(req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Endpoint to get a specific user.'
  await user.get(req.params.id)
    .then(data => {
      res.status(200).send(resFormat.return(data))
    })
    .catch(err => {
      console.error(err)
      res.status(400).send(resFormat.return('Bad Request', 400))
    })
}))

module.exports = router
