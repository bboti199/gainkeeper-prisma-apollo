import { InputType, Field } from "type-graphql";
import { IsOptional } from "class-validator";

@InputType()
export class UpdateRoutineInput {
  @Field({ nullable: true })
  @IsOptional()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  description: string;
}
