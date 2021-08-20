/**
 * ImagesController-module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import fetch from 'node-fetch'
import createHttpError from 'http-errors'
import validator from 'validator'
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
      const image = await Image.getById(id)

      if (!image) {
        next(createHttpError(404, 'Image with id not found'))
        return
      }

      req.image = image

      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Find and send array with all images meta data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next-middleware function.
   */
  async findAll (req, res, next) {
    try {
      const images = await Image.getAll()

      res.json(images)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create a new image and save it to the Image-service.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next-middleware function.
   */
  async create (req, res, next) {
    try {
      const validEncoding = validator.isBase64(req.body.data)

      if (!validEncoding) {
        next(createHttpError(400))
        return
      }

      // Prepare for Image-service
      const imageDataToPost = {
        data: req.body.data,
        contentType: req.body.contentType
      }

      const response = await fetch(`${process.env.IMAGE_API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': `${process.env.IMAGE_ACCESS_TOKEN}`
        },
        body: `${JSON.stringify(imageDataToPost)}`
      })

      if (response.status !== 201) {
        next(createHttpError(500))
        return
      }

      const responseImage = await response.json()

      // Save meta-data to the resource database
      const metaData = await Image.add({
        imageUrl: responseImage.imageUrl,
        description: req.body.description,
        location: req.body.location,
        imgId: responseImage.id
      })

      res
        .status(201)
        .json(metaData)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Send back image that is already loaded to the req-object.
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
      // TODO: Update image to image service
      // TODO: Update metadata in DB for latest updated at

      // res.status(204).json(metadata)
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
      // TODO: await Update model

      // res.status(204) // partially updated
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete an image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next-middleware function.
   */
  async delete (req, res, next) {
    try {
      // Delete in Image-service.
      const response = await fetch(`${process.env.IMAGE_API_URL}/${req.image.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': `${process.env.IMAGE_ACCESS_TOKEN}`
        }
      })

      if (response.status !== 204) {
        next(createHttpError(500))
        return
      }

      // Delete the image meta data from DB.
      await req.image.delete()

      res
        .status(204, 'Image deleted')
        .end()
    } catch (error) {
      next(error)
    }
  }
}
