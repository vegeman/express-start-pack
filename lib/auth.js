import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import botrista from './resFormat.js'

const algor = process.env.JWT_ALGOR
const privateKey = process.env.JWT_PK
const expiresTime = 60 * 60 * 2

const auth = {
  encrypt(password) {
    const salt = crypto.randomBytes(32).toString('hex')
    return {
      password: crypto.pbkdf2Sync(password, salt, 2000, 64, algor).toString('hex'),
      password_salt: salt,
      password_algor: algor,
    }
  },
  decrypt(data, user) {
    if (user.password === crypto.pbkdf2Sync(data.password, user.password_salt, 2000, 64, algor).toString('hex')) {
      return {
        accessToken: jwt.sign({
          userName: data.user_name,
          userType: user.type,
        }, privateKey, { expiresIn: expiresTime }),
        tokenType: 'Bearer',
        accessExpiresIn: expiresTime,
        decoded: {
          userName: data.user_name,
          userType: user.type,
        },
      }
    }
    return false
  },
  verify(req, res, next) {
    let token = req.headers.authorization || req.cookies.token
    if (!token) {
      return res.status(403).send(botrista.return('Forbidden', 50008))
    }
    token = token.replace('Bearer ', '')
    jwt.verify(token, privateKey, (err, decoded) => {
      if (err) {
        return res.status(403).send(botrista.return('Forbidden', 50008))
      }

      req.body.decoded = decoded
      return next()
    })
  },
  refresh(req, res) {
    if (!req.get('authorization')) return res.status(403).send(botrista.return('Forbidden', 403))
    jwt.verify(req.get('authorization').split(' ')[1], privateKey, (err, decoded) => {
      if (err) {
        return res.status(403).send(botrista.return('Forbidden', 403))
      }
      return res.send(botrista.return({
        accessToken: jwt.sign({
          userName: decoded.userName,
          userType: decoded.userType,
        }, privateKey, { expiresIn: expiresTime }),
        tokenType: 'Bearer',
        accessExpiresIn: expiresTime,
      }))
    })
  },
}

module.exports = auth
