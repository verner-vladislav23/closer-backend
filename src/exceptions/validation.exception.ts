export class ValidationException extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ValidationException.prototype);
    }
}