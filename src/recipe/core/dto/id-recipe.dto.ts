import { IsNotEmpty, Length } from 'class-validator';

export class IdRecipeDto {
  @IsNotEmpty()
  @Length(24, 24)
  id: string;
}
