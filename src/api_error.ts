import express from 'express'

export interface ApiError {
    code: number
    message: string
    timestamp: Date
    path: string
    lmps_tracking_id: string
}

export default class ErrorDispatcher {
    private req: express.Request
    private res: express.Response
    private error: ApiError
    private sysError!: Error

    constructor(req: express.Request, res: express.Response) {
        this.req = req
        this.res = res
        this.error = {
            code: 500,
            message: "Internal server error",
            timestamp: new Date(),
            path: req.path,
            lmps_tracking_id: "" // TODO: Generate tracking id
        }
    }

    public setSysError(error: Error): ErrorDispatcher {
        this.sysError = error
        return this
    }

    private send() {
        this.res.status(this.error.code).json(this.error)
    }

    public notFound() {
        this.error.code = 404
        this.error.message = "Not found"
        this.send()
    }

    public itemNotFound(name: string, id: string) {
        this.error.code = 404
        this.error.message = `The reqquested "${name}" with id "${id}" was not found`
        this.send()
    }

    public invalidField(name: string) {
        this.error.code = 400
        this.error.message = `The field "${name}" is invalid`
        this.send()
    }

    public invalidFieldValue(name: string, value: string) {
        this.error.code = 400
        this.error.message = `The field "${name}" has an invalid value "${value}"`
        this.send()
    }

    public missingField(name: string) {
        this.error.code = 400
        this.error.message = `The field "${name}" is missing`
        this.send()
    }

    public invalidMethod() {
        this.error.code = 405
        this.error.message = `The method "${this.req.method}" is not allowed`
        this.send()
    }

    public invalidContentType() {
        this.error.code = 415
        this.error.message = `The content type "${this.req.headers["content-type"]}" is not supported`
        this.send()
    }

    public invalidAcceptType() {
        this.error.code = 406
        this.error.message = `The accept type "${this.req.headers["accept"]}" is not supported`
        this.send()
    }

    public invalidQueryParameter(name: string) {
        this.error.code = 400
        this.error.message = `The query parameter "${name}" is invalid`
        this.send()
    }

    public invalidQueryParameterValue(name: string, value: string) {
        this.error.code = 400
        this.error.message = `The query parameter "${name}" has an invalid value "${value}"`
        this.send()
    }

    public internalServerError() {
        this.error.code = 500
        this.error.message = "Internal server error"
        this.send()
    }

}