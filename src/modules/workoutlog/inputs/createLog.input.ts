import { InputType, Field } from "type-graphql";
import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";
import { CreateLogItemInput } from "./createLogItem.input";
import { Type } from "class-transformer";

@InputType()
export class CreateLogInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  routine: string;

  @Field(() => [CreateLogItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateLogItemInput)
  items: CreateLogItemInput[];
}
