import { ValidationException } from 'src/exceptions/validation.exception'
import { ArgumentsHost, Catch, ExceptionFilter, BadRequestException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import responseStatus from 'src/controllers/responseStatus';

@Catch(ValidationException, BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const status = HttpStatus.BAD_REQUEST;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(status)
      .json({
        status: responseStatus.ERROR,
        message: exception.message,
      });
  }
}
