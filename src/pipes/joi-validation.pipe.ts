import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from '@hapi/joi';
import { ValidationException } from 'src/exceptions/validation.exception'

const _ = require('lodash');

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);

    console.log(error)

    if (error) {
      throw new ValidationException(error.details[0].message);
    }
    return value;
  }
}
