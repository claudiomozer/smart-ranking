import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualiza-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria,interface';

@Injectable()
export class CategoriasService
{
    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
        private readonly jogadoresService: JogadoresService
    ){}

    async criar (criarCategoriaDto: CriarCategoriaDto): Promise<Categoria>
    {
        const { categoria } = criarCategoriaDto;
        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec();

        if (categoriaEncontrada) {
            throw new BadRequestException(`Categoria ${categoria} já cadastrada!`); 
        }

        const categoriaCriada = new this.categoriaModel(criarCategoriaDto);
        return await categoriaCriada.save();
    }

    async consultarTodasCategorias (): Promise<Categoria[]>
    {
        return await this.categoriaModel.find().populate("jogadores").exec();
    }

    async consultarCategoriaPeloId (categoria: string) : Promise<Categoria>
    {
        return await this.buscaPeloIdOuExcessao(categoria);
    }

    async atualizarCategoria(atualizarCategoriaDto: AtualizarCategoriaDto, categoria: string): Promise<void>
    {
        await this.buscaPeloIdOuExcessao(categoria);
        await this.categoriaModel.findOneAndUpdate({categoria}, {$set: atualizarCategoriaDto}).exec();
    }

    private async buscaPeloIdOuExcessao(categoria: string): Promise<Categoria>
    {
        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec();
        
        if(!categoriaEncontrada) {
            throw new NotFoundException(`Categoria ${categoria} não encontrada!`);
        }

        return categoriaEncontrada;
    }

    async atribuirCategoriaJogador(params: string[]): Promise<void>
    {
        const categoria = params['categoria'];
        const idJogador = params['idJogador'];
        const categoriaEncontrada = await this.buscaPeloIdOuExcessao(categoria);
        await this.jogadoresService.consultarJogadorPeloId(idJogador);
        const jogadorJaCadastradoCategoria = await this.categoriaModel
            .find({categoria})
            .where('jogadores')
            .in(idJogador)
            .exec();

        if (jogadorJaCadastradoCategoria.length > 0) {
            throw new BadRequestException(`O Jogador com id ${idJogador} já foi adicionado na categoria ${categoria}`);
        } 

        categoriaEncontrada.jogadores.push(idJogador);
        await this.categoriaModel.findOneAndUpdate({categoria}, {$set: categoriaEncontrada}).exec();
    }

    async buscaCategoriaPeloJogadorId(jogadorId: string): Promise<Categoria>
    {
        var jogadorIds: string[] = [jogadorId];
        return await this.categoriaModel
            .findOne()
            .where('jogadores')
            .in(jogadorIds)
            .exec();
    }
}
