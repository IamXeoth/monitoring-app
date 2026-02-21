/*
  Warnings:

  - You are about to drop the column `errorMessage` on the `incidents` table. All the data in the column will be lost.
  - You are about to drop the column `responseTime` on the `incidents` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `incidents` table. All the data in the column will be lost.
  - You are about to drop the column `statusCode` on the `incidents` table. All the data in the column will be lost.
  - Added the required column `severity` to the `incidents` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "incidents_monitorId_idx";

-- AlterTable
ALTER TABLE "checks" ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "isUp" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "incidents" DROP COLUMN "errorMessage",
DROP COLUMN "responseTime",
DROP COLUMN "status",
DROP COLUMN "statusCode",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isResolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "severity" "IncidentStatus" NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Incident';

-- AlterTable
ALTER TABLE "monitors" ADD COLUMN     "lastChecked" TIMESTAMP(3),
ADD COLUMN     "status" "IncidentStatus" NOT NULL DEFAULT 'UP',
ADD COLUMN     "timeout" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "status_pages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_page_monitors" (
    "id" TEXT NOT NULL,
    "statusPageId" TEXT NOT NULL,
    "monitorId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "status_page_monitors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "status_pages_slug_key" ON "status_pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "status_page_monitors_statusPageId_monitorId_key" ON "status_page_monitors"("statusPageId", "monitorId");

-- CreateIndex
CREATE INDEX "incidents_monitorId_startedAt_idx" ON "incidents"("monitorId", "startedAt");

-- AddForeignKey
ALTER TABLE "status_pages" ADD CONSTRAINT "status_pages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_page_monitors" ADD CONSTRAINT "status_page_monitors_statusPageId_fkey" FOREIGN KEY ("statusPageId") REFERENCES "status_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_page_monitors" ADD CONSTRAINT "status_page_monitors_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "monitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
