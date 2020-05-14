import {
  Resolver,
  Query,
  Ctx,
  Mutation,
  Arg,
  FieldResolver,
  Root,
  Authorized,
} from "type-graphql";
import { User } from "./user.model";
import { ContextType } from "src/types/ContexType";
import { CreateUserInput } from "./inputs/createUser.input";
import { Exercise } from "../exercise/exercise.model";

@Resolver(() => User)
export class UserResolver {
  @Authorized()
  @Query(() => User)
  async me(@Ctx() { prisma, req }: ContextType) {
    return await prisma.user.findOne({
      where: { id: req.userId },
    });
  }

  @Authorized()
  @Query(() => [User])
  async users(@Ctx() { prisma }: ContextType) {
    return await prisma.user.findMany();
  }

  @Authorized()
  @Mutation(() => User, { nullable: true })
  async insert_one_user(
    @Arg("data") data: CreateUserInput,
    @Ctx() { prisma }: ContextType
  ) {
    return await prisma.user.create({
      data,
    });
  }

  @Authorized()
  @Mutation(() => User, { nullable: true })
  async delete_one_user(@Arg("id") id: string, @Ctx() { prisma }: ContextType) {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  @Authorized()
  @FieldResolver(() => [Exercise])
  async exercises(@Ctx() { prisma, req }: ContextType): Promise<Exercise[]> {
    return await prisma.user.findOne({ where: { id: req.userId } }).exercises();
  }
}
