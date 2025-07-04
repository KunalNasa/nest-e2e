import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response: { statusCode: number } = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        return {
          status: response.statusCode,
          message: 'Success',
          data: data ?? null,
        };
      }),
    );
  }
}
