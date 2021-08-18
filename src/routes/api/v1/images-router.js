/**
 * Images routes.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import express from 'express'
import { ImagesController } from '../../../controllers/api/images-controller.js'

export const router = express.Router()

const controller = new ImagesController()

/**
 * Request authentication.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next-middleware function.
 */
const verifyJWT = (req, res, next) => {
  // TODO: Check bearer token
  // TODO: Try verifying token
}

// TODO: Load image for id param

// GET all images
router.get('/',
  verifyJWT,
  (req, res, next) =>
    controller.findAll(req, res, next)
)

// POST a new image
router.post('/',
  verifyJWT,
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
router.put('/',
  verifyJWT,
  (req, res, next) =>
    controller.replace(req, res, next)
)

// PATCH partially update an image
router.patch('/',
  verifyJWT,
  (req, res, next) =>
    controller.modify(req, res, next)
)

// DELETE a specific image
router.delete('/',
  verifyJWT,
  (req, res, next) =>
    controller.delete(req, res, next)
)
