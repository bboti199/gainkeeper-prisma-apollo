import { InputType, Field } from "type-graphql";
import { IsOptional } from "class-validator";
import { ExerciseType } from "@prisma/client";

@InputType()
export class UpdateExerciseInut {
  @Field({ nullable: true })
  @IsOptional()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  body_part: string;

  @Field(() => ExerciseType, { nullable: true })
  @IsOptional()
  type: ExerciseType;

  @Field({ nullable: true })
  @IsOptional()
  is_public: boolean;
}
