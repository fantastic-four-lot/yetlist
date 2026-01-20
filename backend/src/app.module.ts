// ---------------------------
// FILE: src/app.module.ts
// ---------------------------
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { RefreshToken } from './refresh-token/refresh-token.entity';


@Module({
imports: [
ConfigModule.forRoot({ isGlobal: true }),
TypeOrmModule.forRootAsync({
imports: [ConfigModule],
inject: [ConfigService],
useFactory: (config: ConfigService) => ({
type: 'mongodb',
url: config.get<string>('MONGO_URI'),
useNewUrlParser: true,
useUnifiedTopology: true,
database: undefined, // if using database in URI, leave undefined
synchronize: true, // set to false for production
logging: true,
entities: [User, RefreshToken],
}),
}),
UsersModule,
AuthModule,
RefreshToken,
],
})
export class AppModule {}