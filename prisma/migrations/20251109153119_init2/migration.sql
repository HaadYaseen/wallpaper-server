/*
  Warnings:

  - You are about to drop the column `rejectedReason` on the `WallpaperResult` table. All the data in the column will be lost.
  - You are about to drop the column `wallpaperStatus` on the `WallpaperResult` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "WallpaperResult_wallpaperStatus_idx";

-- AlterTable
ALTER TABLE "Wallpaper" ADD COLUMN     "rejectedReason" TEXT,
ADD COLUMN     "wallpaperStatus" "WallpaperStatus" NOT NULL DEFAULT 'SUBMITTED';

-- AlterTable
ALTER TABLE "WallpaperResult" DROP COLUMN "rejectedReason",
DROP COLUMN "wallpaperStatus";

-- CreateIndex
CREATE INDEX "Wallpaper_wallpaperStatus_idx" ON "Wallpaper"("wallpaperStatus");
