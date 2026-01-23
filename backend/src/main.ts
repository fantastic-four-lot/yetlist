// ---------------------------
// FILE: src/main.ts
// ---------------------------
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';


dotenv.config();


async function bootstrap() {
const app = await NestFactory.create(AppModule);
 app.use(cookieParser()); 



app.enableCors({
  origin: (origin, callback) => {
    // Allow no-origin requests (RN, curl, Postman) and any dev host
    if (!origin) return callback(null, true);
    const allowed = [
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/192\.168\.200\.\d+:\d+$/, // adjust to your subnet
    ];
    if (allowed.some(re => re.test(origin))) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});




app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
const port = process.env.PORT || 3000;
// await app.listen( port);
await app.listen(3000, '0.0.0.0');
console.log(`Server running on http://localhost:${port}`);
}
bootstrap();

