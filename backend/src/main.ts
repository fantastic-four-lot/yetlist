// ---------------------------
// FILE: src/main.ts
// ---------------------------
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';


dotenv.config();


async function bootstrap() {
const app = await NestFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
const port = process.env.PORT || 3000;
await app.listen(port);
console.log(`Server running on http://localhost:${port}`);
}
bootstrap();