import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { DesafioStatus } from "../interfaces/desafio-status.enum";

@ValidatorConstraint({ name: 'desafioStatusValidator', async: false })
export class DesafioStatusValidator implements ValidatorConstraintInterface
{
    validate(status: DesafioStatus, args: ValidationArguments)
    {
        return (status !== DesafioStatus.PENDENTE 
            && status !== DesafioStatus.REALIZADO 
            && Object.values(DesafioStatus).includes(status));
    }

    defaultMessage(args: ValidationArguments)
    {
        return 'O status informado é inválido, por favor verifique!'
    }
}