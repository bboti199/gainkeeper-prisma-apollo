# Migration `20200517144825-initdb`

This migration has been generated by bboti199 at 5/17/2020, 2:48:25 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

CREATE TYPE "ExerciseType" AS ENUM ('COMPOUND', 'ISOLATION', 'OTHER');

CREATE TABLE "public"."User" (
"created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"email" text  NOT NULL ,"fid" text  NOT NULL ,"id" text  NOT NULL ,"role" "UserRole" NOT NULL DEFAULT 'USER',
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Exercise" (
"body_part" text  NOT NULL ,"created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"is_public" boolean  NOT NULL DEFAULT false,"name" text  NOT NULL ,"type" "ExerciseType" NOT NULL ,"userId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Routine" (
"created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"description" text   ,"id" text  NOT NULL ,"name" text  NOT NULL ,"userId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."RoutineTemplate" (
"exerciseId" text  NOT NULL ,"id" text  NOT NULL ,"reps" integer  NOT NULL ,"routineId" text   ,"sets" integer  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."WorkoutLog" (
"created_at" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"id" text  NOT NULL ,"routineId" text   ,"userId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."WorkoutLogItem" (
"exerciseId" text   ,"id" text  NOT NULL ,"reps" integer []  ,"sets" integer  NOT NULL ,"weight" Decimal(65,30) []  ,"workoutLogId" text   ,
    PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "User.fid" ON "public"."User"("fid")

CREATE UNIQUE INDEX "User.email" ON "public"."User"("email")

ALTER TABLE "public"."Exercise" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Routine" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."RoutineTemplate" ADD FOREIGN KEY ("routineId")REFERENCES "public"."Routine"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."RoutineTemplate" ADD FOREIGN KEY ("exerciseId")REFERENCES "public"."Exercise"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."WorkoutLog" ADD FOREIGN KEY ("routineId")REFERENCES "public"."Routine"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."WorkoutLog" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."WorkoutLogItem" ADD FOREIGN KEY ("workoutLogId")REFERENCES "public"."WorkoutLog"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."WorkoutLogItem" ADD FOREIGN KEY ("exerciseId")REFERENCES "public"."Exercise"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."RoutineTemplate"
DROP CONSTRAINT "RoutineTemplate_routineId_fkey",
ADD CONSTRAINT "RoutineTemplate_routineId_fkey"
FOREIGN KEY ("routineId")REFERENCES "public"."Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."WorkoutLog"
DROP CONSTRAINT "WorkoutLog_routineId_fkey",
ADD CONSTRAINT "WorkoutLog_routineId_fkey"
FOREIGN KEY ("routineId")REFERENCES "public"."Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."WorkoutLogItem"
DROP CONSTRAINT "WorkoutLogItem_workoutLogId_fkey",
ADD CONSTRAINT "WorkoutLogItem_workoutLogId_fkey"
FOREIGN KEY ("workoutLogId")REFERENCES "public"."WorkoutLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."Routine"
DROP CONSTRAINT "Routine_userId_fkey",
ADD CONSTRAINT "Routine_userId_fkey"
FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200517144825-initdb
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,85 @@
+datasource db {
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model User {
+  id         String       @default(uuid()) @id
+  fid        String       @unique
+  email      String       @unique
+  role       UserRole     @default(USER)
+  created_at DateTime     @default(now())
+  exercises  Exercise[]
+  history    WorkoutLog[]
+  routines   Routine[]
+}
+
+model Exercise {
+  id         String            @default(uuid()) @id
+  name       String
+  body_part  String
+  type       ExerciseType
+  is_public  Boolean           @default(false)
+  created_at DateTime          @default(now())
+  user       User?             @relation(fields: [userId], references: [id])
+  userId     String?
+  templates  RoutineTemplate[]
+  logItems   WorkoutLogItem[]
+}
+
+model Routine {
+  id          String            @default(uuid()) @id
+  name        String
+  description String?
+  template    RoutineTemplate[]
+  history     WorkoutLog[]
+  created_at  DateTime          @default(now())
+  user        User?             @relation(fields: [userId], references: [id])
+  userId      String?
+}
+
+model RoutineTemplate {
+  id         String   @default(uuid()) @id
+  sets       Int
+  reps       Int
+  routine    Routine? @relation(fields: [routineId], references: [id])
+  routineId  String?
+  exercise   Exercise @relation(fields: [exerciseId], references: [id])
+  exerciseId String
+}
+
+model WorkoutLog {
+  id         String           @default(uuid()) @id
+  routine    Routine?         @relation(fields: [routineId], references: [id])
+  routineId  String?
+  user       User             @relation(fields: [userId], references: [id])
+  userId     String
+  items      WorkoutLogItem[]
+  created_at DateTime         @default(now())
+}
+
+model WorkoutLogItem {
+  id           String      @default(uuid()) @id
+  sets         Int
+  reps         Int[]
+  weight       Float[]
+  workoutLog   WorkoutLog? @relation(fields: [workoutLogId], references: [id])
+  workoutLogId String?
+  exercise     Exercise?   @relation(fields: [exerciseId], references: [id])
+  exerciseId   String?
+}
+
+enum UserRole {
+  ADMIN
+  USER
+}
+
+enum ExerciseType {
+  COMPOUND
+  ISOLATION
+  OTHER
+}
```
