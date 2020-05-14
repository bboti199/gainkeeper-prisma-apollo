import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsOptional } from "class-validator";
import { ExerciseType } from "@prisma/client";

@InputType()
export class CreateExerciseInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  body_part: string;

  @Field(() => ExerciseType)
  @IsNotEmpty()
  type: ExerciseType;

  @Field({ defaultValue: false, nullable: true })
  @IsOptional()
  is_public: boolean;
}
