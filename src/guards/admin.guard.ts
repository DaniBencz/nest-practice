import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // without type assertion, ESLint gives:
    // `Unsafe assignment of an `any` value`
    const body = request.body as UserDto;

    // if true is returned, the request is allowed to proceed
    return body.admin === true;
  }
}
