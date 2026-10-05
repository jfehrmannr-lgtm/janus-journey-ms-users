import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
})
export class AppModule {}
