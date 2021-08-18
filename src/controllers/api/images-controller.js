/**
 * ImagesController-module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import createHttpError from 'http-errors'
import { Image } from '../../models/image.js'

/**
 * Encapsulation of controller for images.
 */
export class ImagesController {
  /**
   * Load image to the request object.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next-middleware function.
   * @param {string} id - The image's id.
   */
  async loadImage (req, res, next, id) {
    try {
      //
      const image = await Image.getById(id)

      if (!image) {
        next(createHttpError(404, 'Not Found'))
        return
      }

      req.image = image

      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Find all images.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next-middleware function.
   */
  async findAll (req, res, next) {
    try {
      const mess = {
        mess: 'Found them all!'
      }
      res
        .status(200)
        .json(mess)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create a new image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next-middleware function.
   */
  async create (req, res, next) {}

  /**
   * Send back image as json.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next-middleware function.
   */
  async find (req, res, next) {
    res.json(req.image)
  }

  /**
   * Update an image replacing it.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next-middleware function.
   */
  async replace (req, res, next) {
    try {
      //
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update an image modifying parts of the data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next-middleware function.
   */
  async modify (req, res, next) {
    try {
      //
    } catch (error) {
      next(error)
    }
  }

  /**
   * Find all images.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next-middleware function.
   */
  async delete (req, res, next) {
    try {
      //
    } catch (error) {
      next(error)
    }
  }
}
