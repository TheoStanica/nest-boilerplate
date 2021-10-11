import { Catch, ArgumentsHost, Inject, HttpException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BaseExceptionFilter } from '@nestjs/core';
import { Logger } from 'winston';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    if (!(exception instanceof HttpException)) {
      this.logger.error(exception);
    }
    super.catch(exception, host);
  }
}
