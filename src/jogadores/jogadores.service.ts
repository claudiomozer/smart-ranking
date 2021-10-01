import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuid} from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
export class JogadoresService 
{
    private jogadores: Jogador[] = [ ];
    private readonly logger = new Logger(JogadoresService.name);

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    async salvarJogador (criarJogadorDto: CriarJogadorDto): Promise<void>{
        const { email } = criarJogadorDto;
        const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec();
        if (jogadorEncontrado) {
            this.atualizar(criarJogadorDto);
        } else {
            this.criar(criarJogadorDto);
        }

    }

    private async criar(criarJogadorDto : CriarJogadorDto): Promise<Jogador>
    {
        const jogadorCriado = new this.jogadorModel(criarJogadorDto);
        return await jogadorCriado.save();
    }

    async consultarTodosJogadores() : Promise<Jogador[]> 
    {
        return await this.jogadorModel.find().exec();
    }

    private async atualizar(criarJogadorDto: CriarJogadorDto) : Promise<Jogador>
    {
        let { email } = criarJogadorDto;
        return await this.jogadorModel.findOneAndUpdate(
            {email}, 
            {$set: criarJogadorDto}
        ).exec();
    }

    async consultarJogadorPeloEmail(email: string) : Promise<Jogador>
    {
        const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec();

        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com email ${email}, não foi encontrado.`);
        }

        return jogadorEncontrado;
    }

    async deletarJogador(email: string): Promise<void>
    {
        return await this.jogadorModel.remove({email}).exec();
    }
}
