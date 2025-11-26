import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

// custom pipe to validate that a number is positive
@Injectable()
export class IsPositivePipe implements PipeTransform {
  transform(value: number): number {
    if (value <= 0) {
      throw new BadRequestException('Value must be positive');
    }
    return value;
  }
}
