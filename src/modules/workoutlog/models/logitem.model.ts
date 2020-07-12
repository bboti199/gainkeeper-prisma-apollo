import { ObjectType, Field, ID } from "type-graphql";
import { Exercise } from "../../exercise/models/exercise.model";

@ObjectType()
export class LogItem {
  @Field(() => ID)
  id: string;

  @Field(() => Number)
  sets: number;

  @Field(() => [Number])
  reps: number[];

  @Field(() => [Number])
  weight: number[];

  @Field(() => Exercise)
  exercise: Exercise;
}
