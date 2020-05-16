import { Resolver, Query, Ctx, Authorized, Mutation, Arg } from "type-graphql";
import { Routine } from "./routine.model";
import { ContextType } from "src/types/ContexType";
import { CreateRoutineInput } from "./inputs/createRoutine.input";
import { Exercise } from "../exercise/exercise.model";
import { UpdateRoutineInput } from "./inputs/updateRoutine.input";

@Resolver(() => Routine)
export class RoutineResolver {
  @Authorized()
  @Query(() => [Routine])
  async routines(@Ctx() { prisma, req }: ContextType) {
    return await prisma.routine.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        template: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }

  @Authorized()
  @Mutation(() => Routine, { nullable: true })
  async insert_one_routine(
    @Ctx() { prisma, req }: ContextType,
    @Arg("data") { description, name, template }: CreateRoutineInput
  ) {
    const validTemplates: {
      sets: number;
      reps: number;
      exercise: Exercise;
    }[] = [];

    await Promise.all(
      template.map(async (item) => {
        const exercise = await prisma.exercise.findOne({
          where: {
            id: item.exercise,
          },
        });
        if (exercise) {
          validTemplates.push({
            exercise,
            sets: item.sets,
            reps: item.reps,
          });
        }
      })
    );

    if (validTemplates.length > 0) {
      return await prisma.routine.create({
        data: {
          name,
          description,
          user: {
            connect: {
              id: req.userId,
            },
          },
          template: {
            create: validTemplates.map((item) => {
              return {
                exercise: {
                  connect: {
                    id: item.exercise.id,
                  },
                },
                reps: item.reps,
                sets: item.sets,
              };
            }),
          },
        },
        include: {
          template: {
            include: {
              exercise: true,
            },
          },
        },
      });
    }
    return null;
  }

  @Authorized()
  @Mutation(() => String, { nullable: true })
  async delete_one_routine(
    @Arg("id") id: string,
    @Ctx() { prisma, req }: ContextType
  ) {
    const routine = await prisma.routine.findOne({
      where: {
        id,
      },
    });

    if (routine && routine?.userId === req.userId) {
      await prisma.routineTemplate.deleteMany({
        where: {
          routineId: routine.id,
        },
      });
      await prisma.routine.delete({
        where: { id },
      });

      return routine.id;
    }

    return null;
  }

  @Authorized()
  @Mutation(() => Routine, { nullable: true })
  async update_one_routine(
    @Arg("id") id: string,
    @Arg("data") data: UpdateRoutineInput,
    @Ctx() { prisma, req }: ContextType
  ) {
    const routine = await prisma.routine.findOne({
      where: {
        id,
      },
    });

    if (routine && routine.userId === req.userId) {
      return await prisma.routine.update({
        data,
        where: {
          id,
        },
        include: {
          template: {
            include: {
              exercise: true,
            },
          },
        },
      });
    }

    return null;
  }
}
