import { AuthChecker } from "type-graphql";
import { ContextType } from "src/types/ContexType";
import { firebase } from "./firebase";

export const firebaseAuthChecker: AuthChecker<ContextType> = async ({
  context,
}) => {
  const { prisma, req } = context;

  if (
    req.headers.authorization &&
    req.headers.authorization.includes("Bearer ")
  ) {
    const token = req.headers.authorization.split("Bearer ")[1];
    if (token) {
      try {
        const decodedToken = await firebase.auth().verifyIdToken(token);
        const firebaseUser = await firebase.auth().getUser(decodedToken.uid);
        const localUser = await prisma.user.findOne({
          where: {
            fid: firebaseUser.uid,
          },
        });

        if (localUser) {
          req.userId = localUser.id;
          return true;
        } else {
          const newUser = await prisma.user.create({
            data: {
              email: firebaseUser.email as string,
              fid: firebaseUser.uid,
            },
          });
          req.userId = newUser.id;
          return true;
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.log(err);
        }
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};
