/*
  Warnings:

  - Changed the type of `type` on the `Account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('SAVINGS', 'CHECKING');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAW', 'TRANSFER');

-- AlterTable
ALTER TABLE "Account" 
ALTER COLUMN "type" TYPE "AccountType"
USING UPPER("type")::"AccountType";


-- AlterTable
ALTER TABLE "Transaction"
ALTER COLUMN "type" TYPE "TransactionType"
USING UPPER("type")::"TransactionType";
