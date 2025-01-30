export class ApiError extends Error {
    private _status: number;
    private _message: string;

    constructor(status: number, message: string) {
        super();
        this._status = status;
        this._message = message;
    }

    setStatus = (status: number) => {
        this._status = status;
    }
    get status() {
        return this._status;
    }

    setMessage = (message: string) => {
        this._message = message;
    }
    get message() {
        return this._message;
    }

    static badRequest(message: string) {
        return new ApiError(404, message);
    }
    static internal(message: string) {
        return new ApiError(500, message);
    }
    static forbidden(message: string) {
        return new ApiError(403, message);
    }
}