import express from 'express'
import auth from '../lib/auth'
import user from '../model/user'
const router = express.Router()

router.post('/signin', (req, res, next) => {
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
})

router.get('/users/:id', auth.verify, async(req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Endpoint to get a specific user.'
  const data = await user.get(e => e.id === req.params.id)

  /* #swagger.responses[200] = {
      schema: { "$ref": "#/definitions/resFormat" },
      description: "User registered successfully." } */
  res.status(200).json({
    data: data,
    message: 'Successfully found'
  })
})

module.exports = router
