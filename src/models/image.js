/**
 * Mongoose model of Image.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import mongoose from 'mongoose'
import validator from 'validator'

const { isURL } = validator

const ImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    validate: [isURL, '{VALUE} is not a valid URL.']
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  imgId: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    /**
     * Remove sensitive information.
     *
     * @param {object} mongooseDoc - That is converting.
     * @param {object} representation - The converted plain object.
     */
    transform: function (mongooseDoc, representation) {
      delete representation._id
      delete representation.imgId
    },
    virtuals: true
  }
})

// Only expose the image id from Image service.
ImageSchema.virtual('id').get(function () {
  return this.imgId
})

/**
 * Get all images.
 *
 * @returns {Promise<Image[]>} Promise of all images.
 */
ImageSchema.statics.getAll = async function () {
  return this.find({})
}

/**
 * Get one image by id.
 *
 * @param {string} id - The id of the image.
 * @returns {Promise<Image>} Promise of an image.
 */
ImageSchema.statics.getById = async function (id) {
  return this.findOne({ imgId: id })
}

/**
 * Add a new image.
 *
 * @param {object} data - The image data.
 * @returns {Promise} Promise to be fulfilled.
 */
ImageSchema.statics.add = async function (data) {
  const image = new Image(data)

  return image.save()
}

/**
 * Update an image.
 *
 * @param {object} data - The image data.
 * @returns {Promise} Promise to be fulfilled.
 */
ImageSchema.methods.update = async function (data) {
  if (data.description?.localeCompare(this.description) !== 0) {
    this.description = data.description
  }

  if (data.location?.localeCompare(this.location) !== 0) {
    this.location = data.location
  }

  return this.save()
}

/**
 * Delete an image.
 *
 * @returns {Promise} Promise to be fulfilled.
 */
ImageSchema.methods.delete = async function () {
  return this.remove()
}

export const Image = mongoose.model('Image', ImageSchema)
