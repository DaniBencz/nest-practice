import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getId(id: string): string {
    return `Your ID is: ${id}`;
  }
}
