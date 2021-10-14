import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { DesafioService } from './desafio.service';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio-dto';
import { Desafio } from './interfaces/desafio.interface';

@Controller('/api/v1/desafios')
export class DesafioController {

    private readonly desafioService : DesafioService;

    constructor(desafioService: DesafioService) {
        this.desafioService = desafioService;
    }

    @Post()
    @UsePipes(ValidationPipe)
    async criarDesafio(
        @Body() criarDesafioDto: CriarDesafioDto
    ) : Promise<void>
    {
        await this.desafioService.criarDesafio(criarDesafioDto);
    }

    @Get()
    async consultarTodosDesafios (): Promise<Desafio[]>
    {
        return await this.desafioService.consultarTodosDesafios();
    }

    @Get('/:idJogador')
    async consultarTodosDesafiosDeUmJogador(
        @Param('idJogador', ValidacaoParametrosPipe) idJogador: string): Promise<Desafio[]>
    {
        return await this.desafioService.consultarTodosDesafiosDeUmJogador(idJogador);
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    async atualizarDesafio(
        @Body() atualizarDesafioDto: AtualizarDesafioDto,
        @Param('id', ValidacaoParametrosPipe) id: string
    ):  Promise<void>
    {
        await this.desafioService.atualizarDesafio(id, atualizarDesafioDto);
    }

    @Delete('/:id')
    async deletarDesafio (@Param('id', ValidacaoParametrosPipe) id: string): Promise<void>
    {
        await this.desafioService.deletarDesafio(id);
    }
}
