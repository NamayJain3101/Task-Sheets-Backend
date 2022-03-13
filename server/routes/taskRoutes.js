import express from 'express'
import { createTask, deleteTask, getAllTasksByDate, getAllTasksByUser, getTaskById, getUserStats, updateTask } from '../controllers/taskController.js'
import { admin, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, createTask).get(protect, getAllTasksByUser)
router.route('/stats').get(protect, getUserStats)
router.route('/date').get(protect, getAllTasksByDate)
router.route('/:id').put(protect, updateTask).get(protect, getTaskById).delete(protect, deleteTask)

export default router