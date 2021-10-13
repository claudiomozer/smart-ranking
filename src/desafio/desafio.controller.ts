import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { DesafioService } from './desafio.service';
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
}
