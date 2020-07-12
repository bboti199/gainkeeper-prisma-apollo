import { ObjectType, Field, ID } from "type-graphql";
import { RoutineTemplate } from "./routineTemplate.model";
import { WorkoutLog } from "../../workoutlog/models/workoutlog.model";

@ObjectType()
export class Routine {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [RoutineTemplate])
  template: RoutineTemplate[];

  @Field(() => [WorkoutLog])
  history: WorkoutLog[];

  @Field()
  created_at: Date;
}
