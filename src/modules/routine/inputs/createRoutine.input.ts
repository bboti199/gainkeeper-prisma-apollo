import { InputType, Field } from "type-graphql";
import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";
import { CreateTemplateInput } from "./createTemplate.input";
import { Type } from "class-transformer";

@InputType()
export class CreateRoutineInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @Field(() => [CreateTemplateInput])
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateTemplateInput)
  template: CreateTemplateInput[];
}
