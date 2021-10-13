import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { CategoriaSchema } from 'src/categorias/interfaces/categoria.schema';
import { JogadorSchema } from 'src/jogadores/interfaces/jogador.schema';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { DesafioController } from './desafio.controller';
import { DesafioService } from './desafio.service';
import { DesafioSchema } from './interfaces/desafio.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Desafio', schema: DesafioSchema }]),
    MongooseModule.forFeature([{ name: 'Categoria', schema: CategoriaSchema }]),
    MongooseModule.forFeature([{ name: 'Jogador', schema: JogadorSchema }])
  ],
  controllers: [DesafioController],
  providers: [DesafioService, JogadoresService, CategoriasService]
})
export class DesafioModule {}
