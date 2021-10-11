import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { AllExceptionsFilter } from './core/common/filters/httpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const exceptionsFilter = app.get<AllExceptionsFilter>(AllExceptionsFilter);
  app.useGlobalFilters(exceptionsFilter);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
