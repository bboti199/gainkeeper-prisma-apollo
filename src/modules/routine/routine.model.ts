import { ObjectType, Field, ID } from "type-graphql";
import { RoutineTemplate } from "./routineTemplate.model";

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

  @Field()
  created_at: Date;
}
