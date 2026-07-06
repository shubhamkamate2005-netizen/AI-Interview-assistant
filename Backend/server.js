require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/db/db")

const port = Number(process.env.PORT) || 3000

async function startServer() {
    try {
        await connectDB()
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`)
        })
    } catch (error) {
        console.error("Unable to start server:", error.message)
        process.exit(1)
    }
}

startServer()
