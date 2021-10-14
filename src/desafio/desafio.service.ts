import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio-dto';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Desafio } from './interfaces/desafio.interface';

@Injectable()
export class DesafioService
{
    private readonly desafioModel : Model<Desafio>;
    private readonly jogadoresService: JogadoresService;
    private readonly categoriasService: CategoriasService;
    
    constructor (
        @InjectModel('Desafio') desafioModel: Model<Desafio>,
        jogadoresService: JogadoresService,
        categoriasService: CategoriasService
    ) {
        this.desafioModel = desafioModel;
        this.jogadoresService = jogadoresService;
        this.categoriasService = categoriasService;
    }

    async criarDesafio(criarDesafioDto: CriarDesafioDto ): Promise<void>
    {
        const {jogadores} = criarDesafioDto;

        jogadores.forEach(async (jogador) => {
            await this.jogadoresService.consultarJogadorPeloId(jogador._id);
        });

        const {solicitante} = criarDesafioDto;

        const jogadorSolicitanteEncontrado = jogadores.find( jogador => jogador._id === solicitante._id );
        if (!jogadorSolicitanteEncontrado) {
            throw new BadRequestException(`O solicitante ${solicitante.nome} deve ser um dos jogadores do desafio.`);
        }

        const categoriaEncontrada = await this.categoriasService.buscaCategoriaPeloJogadorId(solicitante._id);
        if(!categoriaEncontrada) {
            throw new NotFoundException(`Nenhuma categoria encontrada ao jogador ${solicitante.nome}`);
        }

        const {dataHoraDesafio} = criarDesafioDto;

        const desafioEncontrado = await this.buscarDesafioPorJogadoresEHora(jogadores, dataHoraDesafio);
        if(desafioEncontrado) {
            throw new BadRequestException(`Já existe um desafio para estes jogadores neste horário.`);
        }

        const data = {
            ...criarDesafioDto,
            categoria: categoriaEncontrada.categoria,
            status: DesafioStatus.PENDENTE
        };

        const newDesafio = new this.desafioModel(data);
        await newDesafio.save();
    }

    async consultarTodosDesafios(): Promise<Desafio[]>
    {
        return await this.desafioModel.find().populate("jogadores").exec();
    }

    async consultarTodosDesafiosDeUmJogador(jogadorId: string): Promise<Desafio[]>
    {
        const ids: string[] = [jogadorId];
        const desafiosEncontrados = await this.desafioModel
            .find()
            .populate("jogadores")
            .where('jogadores')
            .in(ids)
            .exec();

        if (desafiosEncontrados.length < 1) {
            throw new NotFoundException(`Nenhum desafio encontrado para o jogador de id ${jogadorId}`);
        }
        return desafiosEncontrados;
    }

    private async buscarDesafioPorJogadoresEHora(jogadores: Array<Jogador>, dataHoraDesafio: Date) {
        const jogadoresIds = jogadores.map(jogador => jogador._id);

        const desafioEncontrado = await this.desafioModel
            .findOne({dataHoraDesafio})
            .where('jogadores')
            .in(jogadoresIds)
            .exec();
        return desafioEncontrado;
    }

    async atualizarDesafio(id: string, atualizarDesafioDto: AtualizarDesafioDto): Promise<void>
    {
        await this.existeDesafioPeloId(id);
        await this.desafioModel.findOneAndUpdate(
            {_id: id}, 
            {$set: atualizarDesafioDto}
        ).exec();
    }

    async deletarDesafio(id: string): Promise<void>
    {
        await this.existeDesafioPeloId(id);
        await this.desafioModel.deleteOne({_id: id});
    }

    private async existeDesafioPeloId(id: string) : Promise<void>
    {
        const desafioEncontrado = await this.desafioModel.findOne({_id: id}).exec();

        if (!desafioEncontrado) {
            throw new NotFoundException(`Desafio com id ${id} não foi encontrado.`);
        }
    }

}
