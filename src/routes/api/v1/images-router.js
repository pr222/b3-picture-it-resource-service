/**
 * Images routes.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import express from 'express'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { ImagesController } from '../../../controllers/api/images-controller.js'

export const router = express.Router()

const controller = new ImagesController()

//
// ///////////////// HELPERS /////////////////
//
/**
 * Request authentication.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next-middleware function.
 */
const verifyJWT = (req, res, next) => {
  // Check bearer token
  const authorization = req.headers.authorization?.split(' ')

  if (authorization?.[0] !== 'Bearer') {
    next(createHttpError(401, 'Bearer token is missing'))
    return
  }

  // Verify JWT
  try {
    const base64 = process.env.PUBLIC_KEY

    const publicKey = Buffer.from(base64, 'base64')

    const payload = jwt.verify(authorization[1], publicKey)

    req.email = {
      email: payload.email
    }

    next()
  } catch (error) {
    next(createHttpError(403, 'JWT Validation failed'))
  }
}

/**
 * Validate Base64-encoding.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next-middleware function.
 */
const validateBase64 = (req, res, next) => {
  const validEncoding = validator.isBase64(req.body.data)

  if (!validEncoding) {
    next(createHttpError(400))
    return
  }

  next()
}

//
// ///////////////// ROUTES /////////////////
//

// Make image available in the request-object
// if id parameter is present.
router.param('id', (req, res, next, id) => controller.loadImage(req, res, next, id))

// GET all images
router.get('/',
  verifyJWT,
  (req, res, next) =>
    controller.findAll(req, res, next)
)

// POST a new image
router.post('/',
  verifyJWT,
  validateBase64,
  (req, res, next) =>
    controller.create(req, res, next)
)

// GET a specific image
router.get('/:id',
  verifyJWT,
  (req, res, next) =>
    controller.find(req, res, next)
)

// PUT update an image
router.put('/:id',
  verifyJWT,
  validateBase64,
  (req, res, next) =>
    controller.replace(req, res, next)
)

// PATCH partially update an image
router.patch('/:id',
  verifyJWT,
  (req, res, next) =>
    controller.modify(req, res, next)
)

// DELETE a specific image
router.delete('/:id',
  verifyJWT,
  (req, res, next) =>
    controller.delete(req, res, next)
)
