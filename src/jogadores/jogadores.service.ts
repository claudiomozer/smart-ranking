import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuid} from 'uuid';
@Injectable()
export class JogadoresService 
{
    private jogadores: Jogador[] = [ ];
    private readonly logger = new Logger(JogadoresService.name);

    async salvarJogador (criarJogadorDto: CriarJogadorDto): Promise<void>{
        const { email } = criarJogadorDto;
        const jogadorEncontrado = this.jogadores.find(jogador => {
            return jogador.email == email;
        });
        if (jogadorEncontrado) {
            this.atualizar(jogadorEncontrado, criarJogadorDto);
        } else {
            this.criar(criarJogadorDto);
        }

    }

    private criar(criarJogadorDto : CriarJogadorDto): void
    {
        const { nome, telefone, email } = criarJogadorDto;
        const jogador: Jogador = {
            _id: uuid(),
            nome,
            telefone,
            email,
            ranking: 'A',
            posicaoRanking: 1,
            urlFotoJogador: ''
        };
        this.logger.log(`jogador: ${JSON.stringify(jogador)}`);
        this.jogadores.push(jogador);
    }

    async consultarTodosJogadores() : Promise<Jogador[]> 
    {
        return this.jogadores;
    }

    private atualizar(jogadorEncontrado: Jogador, criarJogadorDto: CriarJogadorDto) : void
    {
        const { nome } = criarJogadorDto;
        jogadorEncontrado.nome = nome;
    }

    async consultarJogadorPeloEmail(email: string) : Promise<Jogador>
    {
        const jogadorEncontrado = this.jogadores.find((jogador) => {
            return jogador.email === email;
        });

        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com email ${email}, não foi encontrado.`);
        }

        return jogadorEncontrado;
    }

    async deletarJogador(email: string): Promise<void>
    {
        this.jogadores = this.jogadores.filter((jogador) => {
            return jogador.email !== email;
        });
    }
}
