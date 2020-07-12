import { Resolver, Query, Authorized, Ctx, Mutation, Arg } from "type-graphql";
import { WorkoutLog } from "./models/workoutlog.model";
import { ContextType } from "src/types/ContexType";
import { CreateLogInput } from "./inputs/createLog.input";
import { Exercise } from "../exercise/models/exercise.model";

@Resolver(() => WorkoutLog)
export class WorkoutLogResolver {
  @Authorized()
  @Query(() => [WorkoutLog])
  async workout_logs(@Ctx() { prisma, req }: ContextType) {
    return await prisma.workoutLog.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        items: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }

  @Authorized()
  @Mutation(() => WorkoutLog, { nullable: true })
  async insert_one_log(
    @Arg("data") data: CreateLogInput,
    @Ctx() { prisma, req }: ContextType
  ) {
    const routine = await prisma.routine.findOne({
      where: {
        id: data.routine,
      },
    });

    if (routine && routine.userId === req.userId) {
      const validTemplates: {
        sets: number;
        reps: number[];
        weight: number[];
        exercise: Exercise;
      }[] = [];

      await Promise.all(
        data.items.map(async (item) => {
          const exercise = await prisma.exercise.findOne({
            where: { id: item.exercise },
          });

          if (exercise) {
            validTemplates.push({
              exercise,
              sets: item.sets,
              reps: item.reps,
              weight: item.weight,
            });
          }
        })
      );

      if (validTemplates.length > 0) {
        return await prisma.workoutLog.create({
          data: {
            routine: {
              connect: {
                id: routine.id,
              },
            },
            user: {
              connect: {
                id: req.userId,
              },
            },
            items: {
              create: validTemplates.map((item) => {
                return {
                  exercise: {
                    connect: {
                      id: item.exercise.id,
                    },
                  },
                  reps: { set: item.reps },
                  sets: item.sets,
                  weight: { set: item.weight },
                };
              }),
            },
          },
          include: {
            items: {
              include: {
                exercise: true,
              },
            },
          },
        });
      } else {
        return null;
      }
    }

    return null;
  }
}
