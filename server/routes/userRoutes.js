import express from 'express'
import { authUser, getUserProfile, registerUser, updateUserProfile } from '../controllers/userController.js'
import { admin, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(registerUser).put(protect, updateUserProfile).get(protect, getUserProfile)
router.route('/login').post(authUser)

export default router