import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
// pass fmQorOhJABILxrFL
// string conexao mongodb+srv://admin:<password>@cluster0.h6wxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority