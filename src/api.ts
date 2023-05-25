import express from "express"
import project from "./api/project"

const logger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`(${new Date().toUTCString()}) Request: ${req.method} ${req.url}`)
    next()
}

const enable_logging = process.env.NODE_ENV === "development"

const router = express.Router()

if (enable_logging) {
    router.use(logger)
}

router.use(express.json())

router.use("/projects", project)

export default router;

// Path: src\api.ts
