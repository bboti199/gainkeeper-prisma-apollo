import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsUUID, IsPositive } from "class-validator";

@InputType()
export class CreateTemplateInput {
  @Field()
  @IsNotEmpty()
  @IsPositive()
  sets: number;

  @Field()
  @IsNotEmpty()
  @IsPositive()
  reps: number;

  @Field()
  @IsUUID()
  @IsNotEmpty()
  exercise: string;
}
