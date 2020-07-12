import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { UserResolver } from "./modules/user/user.resolver";
import { ExerciseResolver } from "./modules/exercise/exercise.resolver";
import { config } from "dotenv";
import { firebaseAuthChecker } from "./firebase/authChecker";
import { RoutineResolver } from "./modules/routine/routine.resolver";
import { WorkoutLogResolver } from "./modules/workoutlog/workoutlog.resolver";

const prisma = new PrismaClient();
config();

const main = async () => {
  const apolloServer = new ApolloServer({
    context: ({ req }) => ({ prisma, req }),
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        ExerciseResolver,
        RoutineResolver,
        WorkoutLogResolver,
      ],
      authChecker: firebaseAuthChecker,
    }),
  });
  const app = express();

  apolloServer.applyMiddleware({ app });

  app.listen(process.env.PORT || 4000, () => {
    console.log("🚀 Server ready at http://localhost:4000/graphql");
  });
};

main()
  .catch((e) => {
    console.log(e);
    throw e;
  })
  .finally(async () => {
    await prisma.disconnect();
  });
