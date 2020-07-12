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