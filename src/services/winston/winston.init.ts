// import { Injectable, LoggerService } from '@nestjs/common';
// import * as winston from 'winston';

// @Injectable()
// export class WinstonLoggerService implements LoggerService {
//   private logger: winston.Logger;

//   constructor() {
//     this.logger = winston.createLogger({
//       transports: [
//         // new winston.transports.Console(),
//         new winston.transports.File({ filename: 'logs.log' }),
//       ],
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json(),
//       ),
//     });
//   }

//   log(message: string) {
//     this.logger.info(message);
//   }

//   error(message: string, trace: string) {
//     this.logger.error(message, trace);
//   }

//   warn(message: string) {
//     this.logger.warn(message);
//   }

//   debug(message: string) {
//     this.logger.debug(message);
//   }

//   verbose(message: string) {
//     this.logger.verbose(message);
//   }
// }
