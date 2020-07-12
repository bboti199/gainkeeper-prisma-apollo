import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsArray, ArrayMinSize, IsUUID } from "class-validator";

@InputType()
export class CreateLogItemInput {
  @Field()
  @IsNotEmpty()
  sets: number;

  @Field(() => [Number])
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  reps: number[];

  @Field(() => [Number])
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  weight: number[];

  @Field()
  @IsNotEmpty()
  @IsUUID()
  exercise: string;
}
