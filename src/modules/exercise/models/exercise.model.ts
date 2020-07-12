import { ObjectType, ID, Field, registerEnumType } from "type-graphql";
import { ExerciseType } from "@prisma/client";

registerEnumType(ExerciseType, { name: "ExerciseType" });

@ObjectType()
export class Exercise {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  body_part: string;

  @Field(() => ExerciseType)
  type: ExerciseType;

  @Field()
  is_public: boolean;

  @Field()
  created_at: Date;
}
