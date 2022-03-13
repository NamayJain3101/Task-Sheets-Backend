import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import helmet from 'helmet'
import cors from 'cors'
import connectDB from './config/db.js'

import userRoutes from './routes/userRoutes.js'
import taskRoutes from './routes/taskRoutes.js'

import { errorHandler, notFound } from './middlewares/errorMiddleware.js'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
)
app.use(cors())

app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.use(notFound)
app.use(errorHandler)

const PORT = parseInt(process.env.PORT) || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))