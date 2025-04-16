/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vpcCidr` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- First, add vpcCidr with a default value
ALTER TABLE "Project" ADD COLUMN "vpcCidr" TEXT NOT NULL DEFAULT '10.0.0.0/16';

-- Then, update any NULL descriptions to empty string
UPDATE "Project" SET "description" = '' WHERE "description" IS NULL;

-- Now we can make description required
ALTER TABLE "Project" ALTER COLUMN "description" SET NOT NULL;

-- Finally, add the unique constraint
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");
