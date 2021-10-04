import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor(private readonly jogadoresService: JogadoresService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador(
        @Body() criarJogadorDto: CriarJogadorDto
    ) : Promise<Jogador>
    {
        const { email } = criarJogadorDto;
        return this.jogadoresService.criarJogador(criarJogadorDto);
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(
        @Body() atualizarJogadorDto: AtualizarJogadorDto,
        @Param('id', ValidacaoParametrosPipe) id: string
    ):  Promise<Jogador>
    {
        return this.jogadoresService.atualizarJogador(id, atualizarJogadorDto);
    }

    @Get()
    async consultarTodosJogadores() : Promise<Jogador[]> 
    {
        return this.jogadoresService.consultarTodosJogadores();
    }

    @Get('/:id')
    async consultarJogadorPeloId(
        @Param('id', ValidacaoParametrosPipe) id: string
    ) : Promise<Jogador> {
        return this.jogadoresService.consultarJogadorPeloId(id);
    }

    @Delete('/:id')
    async deletarJogador(
        @Param('id', ValidacaoParametrosPipe) id: string
    ) : Promise<void> {
        this.jogadoresService.deletarJogador(id);
    }
}
    