import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { InternalAuthGuard } from './auth/internal-auth.guard.js';
import { UsersModule } from './users/users.module.js';
import { validateEnvironment } from './config/configuration.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validate: validateEnvironment,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dbName: config.getOrThrow<string>('MONGODB_DATABASE_NAME'),
        serverSelectionTimeoutMS: config.getOrThrow<number>(
          'MONGODB_SERVER_SELECTION_TIMEOUT_MS',
        ),
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: InternalAuthGuard,
    },
  ],
})
export class AppModule {}
