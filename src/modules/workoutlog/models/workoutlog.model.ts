import { ObjectType, Field, ID } from "type-graphql";
import { LogItem } from "./logitem.model";

@ObjectType()
export class WorkoutLog {
  @Field(() => ID)
  id: string;

  @Field(() => [LogItem])
  items: LogItem[];

  @Field(() => Date)
  created_at: Date;
}
