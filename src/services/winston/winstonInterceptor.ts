// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { WinstonLoggerService } from './winston.init';

// @Injectable()
// export class WinstonInterceptor implements NestInterceptor {
//   constructor(private readonly logger: WinstonLoggerService) {}

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
//     const method = request.method;
//     const url = request.url;

//     return next.handle().pipe(
//       tap(() => {
//         const statusCode = context.switchToHttp().getResponse().statusCode;
//         this.logger.log(`${method} ${url} ${statusCode}`);
//       }),
//     );
//   }
// }
