import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
// pass fmQorOhJABILxrFL
// string conexao mongodb+srv://admin:<password>@cluster0.h6wxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority