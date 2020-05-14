import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsEmail } from "class-validator";

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  fid: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
