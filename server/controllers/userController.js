import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @desc    Auth User & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            imageUrl: user.imageUrl,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(req, res) => {
    const { email, password, name, imageUrl } = req.body

    const regExpName = /[A-Za-z]{3,}/g
    if (!regExpName.test(name)) {
        res.status(400)
        throw new Error('Invalid Name syntax')
    }

    const regExpPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*?>< ])[a-zA-Z0-9!@#$%^&*?>< ]{8,15}$/
    if (!regExpPassword.test(password)) {
        res.status(400)
        throw new Error('Password must contain at least 1 digit, 1 special character, 1 character and length between 8-15')
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    const user = await User.create({
        name,
        email,
        password,
        imageUrl
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            imageUrl: user.imageUrl,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Update User Profile
// @route   PUT /api/users
// @access  Private
const updateUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        if (req.body.name) {
            const regExpName = /\s*([A-Za-z]+([\.,] |[-']| )?)[A-Za-z]*\s*$/g
            if (!regExpName.test(req.body.name)) {
                res.status(400)
                throw new Error('Invalid Name syntax')
            }
        }

        if (req.body.password) {
            const regExpPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*?>< ])[a-zA-Z0-9!@#$%^&*?>< ]{8,15}$/
            if (!regExpPassword.test(req.body.password)) {
                res.status(400)
                throw new Error('Password must contain at least 1 digit, 1 special character, 1 character and length between 8-15')
            }
        }

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.imageUrl = req.body.imageUrl || user.imageUrl
        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            imageUrl: updatedUser.imageUrl,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Get User Profile
// @route   GET /api/users
// @access  Private
const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    authUser,
    registerUser,
    updateUserProfile,
    getUserProfile,
}