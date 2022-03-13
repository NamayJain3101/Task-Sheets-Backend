import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    pending: {
        type: Boolean,
        default: true,
    },
    done: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: String,
        required: true,
        default: 'low'
    },
    priorityLevel: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    startTime: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    endTime: {
        type: Date,
        required: true,
        default: Date.now(),
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

export default Task