import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: null,
        data,
      })),
      catchError((error) => {
        return new Observable((observer) => {
          observer.next({
            success: false,
            message: error.message || 'An error occurred',
            data: null,
          });
          observer.complete();
        });
      }),
    );
  }
}
