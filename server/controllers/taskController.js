import asyncHandler from 'express-async-handler'
import Task from '../models/taskModel.js'

// @desc    CREATE A TASK
// @route   POST /api/tasks/
// @access  Private
const createTask = asyncHandler(async(req, res) => {
    const {
        title,
        description,
        priority,
        pending,
        done,
        startTime,
        endTime,
    } = req.body
    const { user } = req
    const task = new Task({
        title,
        description,
        priority,
        priorityLevel: priority == 'high' ? 2 : priority == 'medium' ? 1 : 0,
        pending,
        done,
        user: user._id,
        startTime: startTime,
        endTime: endTime,
    })
    const createdTask = await task.save()
    res.status(201).json(createdTask)
})

// @desc    CREATE A TASK
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async(req, res) => {
    const {
        title,
        description,
        priority,
        pending,
        done,
    } = req.body
    const taskId = req.params.id
    const { user } = req

    const task = await Task.findById({ _id: taskId, user: user._id })

    if (task) {
        task.title = title
        task.description = description
        task.priority = priority
        task.priorityLevel = priority == 'high' ? 2 : priority == 'medium' ? 1 : 0
        task.pending = pending
        task.done = done

        const updatedTask = await task.save()

        res.json(updatedTask)
    } else {
        res.status(404)
        throw new Error('Task not found')
    }
})

// @desc    GET ALL TASKS BY DATE
// @route   GET /api/tasks/date
// @access  Private
const getAllTasksByDate = asyncHandler(async(req, res) => {
    const { user } = req
    const filter = req.query
    const startDate = new Date(filter.date);
    const endDate = new Date(filter.date)
    endDate.setDate(startDate.getDate() + 1)

    const tasks = await Task.find({
        user: user._id,
        startTime: {
            $gte: startDate,
            $lte: endDate,
        },
        endTime: {
            $gte: startDate,
            $lte: endDate,
        },
    }).sort({ startTime: 1 })

    if (tasks && tasks.length > 0) {
        res.status(201).json(tasks)
    } else {
        res.status(404)
        throw new Error('No Tasks Found')
    }
})

// @desc    GET ALL TASKS BY USER
// @route   GET /api/tasks/
// @access  Private
const getAllTasksByUser = asyncHandler(async(req, res) => {
    const { user } = req
    const filter = req.query
    const pending = filter.pending == 'true'
    const done = filter.done == 'true'
    const pendingLimit = parseInt(filter.pendingLimit)
    const doneLimit = parseInt(filter.doneLimit)

    let allTasks = [],
        pendingTasks = [],
        doneTasks = [],
        tasks = []
    if (pending) {
        let tempTasks = []
        if (pendingLimit) {
            tempTasks = await Task.find({ user: user._id, pending: true }).sort({ createdAt: -1 }).limit(pendingLimit)
        } else {
            tempTasks = await Task.find({ user: user._id, pending: true }).sort({ priorityLevel: -1, createdAt: -1 })
        }
        pendingTasks = [...tempTasks]
    }
    if (done) {
        let tempTasks = []
        if (doneLimit) {
            tempTasks = await Task.find({ user: user._id, done: true }).sort({ createdAt: -1 }).limit(doneLimit)
        } else {
            tempTasks = await Task.find({ user: user._id, done: true }).sort({ priorityLevel: -1, createdAt: -1 })
        }
        doneTasks = [...tempTasks]
    } else {
        tasks = await Task.find({ user: user._id }).sort({ pending: -1, createdAt: -1 })
    }
    if (pendingTasks.length > 0 || doneTasks.length > 0) {
        allTasks = [...pendingTasks, ...doneTasks]
    } else {
        allTasks = [...tasks]
    }
    if (allTasks && allTasks.length > 0) {
        res.status(201).json(allTasks)
    } else {
        res.status(404)
        throw new Error('No Tasks Found')
    }
})

// @desc    GET TASK BY ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async(req, res) => {
    const { user } = req;
    const taskId = req.params.id

    const task = await Task.find({ _id: taskId, user: user._id })
    if (task) {
        res.status(201).json(task[0])
    } else {
        res.status(404)
        throw new Error('No Task Found')
    }
})

// @desc    DELETE TASK BY ID
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async(req, res) => {
    const { user } = req;
    const taskId = req.params.id

    const task = await Task.find({ _id: taskId, user: user._id })
    if (task) {
        await task[0].remove()
        res.send('Task removed')
    } else {
        res.status(404)
        throw new Error('No Task Found')
    }
})

// @desc    GET TASK BY ID
// @route   GET /api/tasks/stats
// @access  Private
const getUserStats = asyncHandler(async(req, res) => {
    const { user } = req;

    const totalTasks = await Task.find({ user: user._id }).countDocuments()
    const pendingTasks = await Task.find({ user: user._id, pending: true }).countDocuments()
    const highPriorityPendingTasks = await Task.find({ user: user._id, pending: true, priority: "high" }).countDocuments()
    const mediumPriorityPendingTasks = await Task.find({ user: user._id, pending: true, priority: "medium" }).countDocuments()
    const lowPriorityPendingTasks = await Task.find({ user: user._id, pending: true, priority: "low" }).countDocuments()
    const doneTasks = await Task.find({ user: user._id, done: true }).countDocuments()
    if (totalTasks) {
        res.status(201).json({
            totalTasks,
            pendingTasks,
            highPriorityPendingTasks,
            mediumPriorityPendingTasks,
            lowPriorityPendingTasks,
            doneTasks
        })
    } else {
        res.status(404)
        throw new Error('No Stats Found')
    }
})

export {
    createTask,
    updateTask,
    getAllTasksByUser,
    getTaskById,
    deleteTask,
    getUserStats,
    getAllTasksByDate
}