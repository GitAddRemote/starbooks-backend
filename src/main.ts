// src/main.ts
import * as pgSession from 'connect-pg-simple';
import { Pool } from 'pg';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
  });
  
  const pgPool = new Pool({
    host: configService.get('DB_HOST'),
    port: +configService.get<number>('DB_PORT'),
    user: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
  });

  app.enableCors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'], // Replace with your frontend URL
    credentials: true,
  });

  app.use(
    session({
      store: new (pgSession(session))({
        pool: pgPool,
        tableName: 'user_sessions',
        createTableIfMissing: true,
      }),      
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax', // Adjust as needed
        secure: false, // Set to true if using HTTPS
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(configService.get('PORT') | 3000);
}
bootstrap();
