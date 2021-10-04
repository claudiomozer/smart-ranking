import { Module } from '@nestjs/common';
import { JogadoresModule } from './jogadores/jogadores.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from './categorias/categorias.module';

var connectionString : string = 'mongodb+srv://admin:fmQorOhJABILxrFL@cluster0.h6wxv.mongodb.net/smartranking?retryWrites=true&w=majority';
var connectionParams : object = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

@Module({
  imports: [
    JogadoresModule,
    MongooseModule.forRoot(connectionString, connectionParams),
    CategoriasModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
