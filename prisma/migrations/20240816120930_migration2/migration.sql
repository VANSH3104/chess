/*
  Warnings:

  - Made the column `score` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "score" SET DEFAULT 1200;
