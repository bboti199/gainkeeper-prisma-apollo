import { Resolver, Query, Ctx, Mutation, Arg, Authorized } from "type-graphql";
import { Exercise } from "./models/exercise.model";
import { ContextType } from "src/types/ContexType";
import { CreateExerciseInput } from "./inputs/createExercise.input";
import { UpdateExerciseInut } from "./inputs/updateExercise.input";
import { ExerciseType } from "@prisma/client";
import exercises from "./seed/exercises.json";

@Resolver(() => Exercise)
export class ExerciseResolver {
  @Authorized()
  @Query(() => [Exercise])
  async exercises(@Ctx() { prisma, req }: ContextType) {
    return await prisma.exercise.findMany({
      where: {
        OR: [
          {
            is_public: true,
          },
          {
            userId: req.userId,
          },
        ],
      },
    });
  }

  @Query(() => String)
  async seed(@Ctx() { prisma }: ContextType) {
    if (process.env.NODE_ENV === "development") {
      const exercisesInserted = await Promise.all(
        exercises.map(async (exercise) => {
          return await prisma.exercise.create({
            data: {
              body_part: exercise.body_part,
              name: exercise.name,
              type: exercise.type as ExerciseType,
              is_public: true,
            },
          });
        })
      );

      console.log(exercisesInserted.length);
      return "seeded";
    } else {
      return "seed not allowed in production mode";
    }
  }

  @Authorized()
  @Mutation(() => Exercise)
  async insert_one_exercise(
    @Arg("data") data: CreateExerciseInput,
    @Ctx() { prisma, req }: ContextType
  ) {
    return await prisma.exercise.create({
      data: {
        user: {
          connect: {
            id: req.userId,
          },
        },
        ...data,
      },
    });
  }

  @Authorized()
  @Mutation(() => String, { nullable: true })
  async delete_one_exercise(
    @Arg("id") id: string,
    @Ctx() { prisma, req }: ContextType
  ) {
    const exercise = await prisma.exercise.findOne({
      where: {
        id,
      },
    });

    if (exercise && exercise?.userId === req.userId) {
      await prisma.exercise.delete({ where: { id: exercise?.id } });

      return exercise.id;
    }

    return null;
  }

  @Authorized()
  @Mutation(() => Exercise, { nullable: true })
  async update_one_exercise(
    @Arg("id") id: string,
    @Arg("data") data: UpdateExerciseInut,
    @Ctx() { prisma, req }: ContextType
  ) {
    const exercise = await prisma.exercise.findOne({
      where: {
        id,
      },
    });

    if (exercise && exercise?.userId === req.userId) {
      return await prisma.exercise.update({
        data,
        where: {
          id,
        },
      });
    } else {
      return null;
    }
  }
}
