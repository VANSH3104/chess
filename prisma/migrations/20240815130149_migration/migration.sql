/*
  Warnings:

  - Added the required column `type` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "oauth_token" TEXT,
ADD COLUMN     "oauth_token_secret" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;
