/**
 * Routes for API v1.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { router as imagesRouter } from './images-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'You got Resource API v1!' }))

router.use('/images', imagesRouter)
