import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as shortid from 'shortid';

@Injectable()
export class ParseShortIdPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!shortid.isValid(value)) {
      throw new BadRequestException('Invalid ID format');
    }
    return value;
  }
}

