import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadorSchema } from 'src/jogadores/interfaces/jogador.schema';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { CategoriaSchema } from './interfaces/categoria.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Categoria', schema: CategoriaSchema }]),
    MongooseModule.forFeature([{ name: 'Jogador', schema: JogadorSchema }])
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService, JogadoresService]
})
export class CategoriasModule {}
