import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { YSocketIO } from 'y-socket.io/dist/server'
import path from 'path'
import { fileURLToPath } from 'url'

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

// Serve frontend build
const publicPath = path.join(__dirname, 'public')
app.use(express.static(publicPath))

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Server is healthy',
    success: true,
  })
})

// Create HTTP server
const httpServer = createServer(app)

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*', // You can restrict this later
    methods: ['GET', 'POST'],
  },
})

// Setup Yjs WebSocket server
const ySocketIO = new YSocketIO(io)
ySocketIO.initialize()

// React routing fallback (VERY IMPORTANT)
app.use((req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

// Use dynamic port for deployment
const PORT = process.env.PORT || 3000

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})