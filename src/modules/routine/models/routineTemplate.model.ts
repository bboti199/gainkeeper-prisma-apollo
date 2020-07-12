import { ObjectType, ID, Field } from "type-graphql";
import { Exercise } from "../../exercise/models/exercise.model";

@ObjectType()
export class RoutineTemplate {
  @Field(() => ID)
  id: string;

  @Field()
  sets: number;

  @Field()
  reps: number;

  @Field(() => Exercise)
  exercise: Exercise;
}
