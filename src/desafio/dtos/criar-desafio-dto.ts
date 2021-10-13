import { ArrayMaxSize, ArrayMinSize, IsDateString, IsNotEmpty } from "class-validator";
import { Jogador } from "src/jogadores/interfaces/jogador.interface";

export class CriarDesafioDto
{
    @IsNotEmpty()
    @IsDateString()
    dataHoraDesafio: Date;

    @IsNotEmpty()
    solicitante: Jogador;

    @IsNotEmpty()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    jogadores: Array<Jogador>;
}