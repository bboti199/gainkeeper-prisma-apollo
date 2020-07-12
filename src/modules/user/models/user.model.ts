import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import { UserRole } from "@prisma/client";
import { Exercise } from "../../exercise/models/exercise.model";

registerEnumType(UserRole, { name: "UserRole" });

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  fid: string;

  @Field()
  email: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => [Exercise])
  exercises: Exercise[];
}
