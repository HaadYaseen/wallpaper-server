-- CreateEnum
CREATE TYPE "ContestType" AS ENUM ('DESKTOP', 'MOBILE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'SUPER_ADMIN', 'JUDGE');

-- CreateEnum
CREATE TYPE "ContestStatus" AS ENUM ('DRAFT', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Orientation" AS ENUM ('PORTRAIT', 'LANDSCAPE');

-- CreateEnum
CREATE TYPE "WallpaperStatus" AS ENUM ('SUBMITTED', 'PENDING', 'JUDGED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OTPType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'TWO_FACTOR_AUTH', 'LOGIN_VERIFICATION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "googleId" TEXT,
    "avatar" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "bankName" TEXT,
    "accountNumber" TEXT,
    "accountUsername" TEXT,
    "lastParticipatedContestId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "bannedReason" TEXT,
    "bannedAt" TIMESTAMP(3),
    "bannedUntil" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contest" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "contestStatus" "ContestStatus" NOT NULL DEFAULT 'DRAFT',
    "contestType" "ContestType" NOT NULL DEFAULT 'DESKTOP',
    "totalPrize" INTEGER NOT NULL DEFAULT 0,
    "firstPrize" INTEGER NOT NULL DEFAULT 0,
    "secondPrize" INTEGER NOT NULL DEFAULT 0,
    "thirdPrize" INTEGER NOT NULL DEFAULT 0,
    "resultAnnouncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContestResult" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "firstPlaceUserId" TEXT,
    "secondPlaceUserId" TEXT,
    "thirdPlaceUserId" TEXT,
    "firstPlaceWallpaperId" TEXT,
    "secondPlaceWallpaperId" TEXT,
    "thirdPlaceWallpaperId" TEXT,
    "honorableMentions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "wallpaperUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContestResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallpaper" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "submittedById" TEXT NOT NULL,
    "isContestWallpaper" BOOLEAN NOT NULL DEFAULT true,
    "isSubmittedByOwner" BOOLEAN NOT NULL DEFAULT false,
    "resolution" TEXT NOT NULL,
    "orientation" "Orientation" NOT NULL DEFAULT 'PORTRAIT',
    "isLiveWallpaper" BOOLEAN NOT NULL DEFAULT false,
    "isAudioEnabled" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "contestId" TEXT,
    "overallRating" INTEGER NOT NULL DEFAULT 0,
    "publicRating" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallpaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WallpaperResult" (
    "id" TEXT NOT NULL,
    "wallpaperId" TEXT,
    "overallRating" INTEGER NOT NULL DEFAULT 0,
    "publicRating" INTEGER NOT NULL DEFAULT 0,
    "readability" INTEGER NOT NULL DEFAULT 0,
    "socialCredit" INTEGER NOT NULL DEFAULT 0,
    "versatility" INTEGER NOT NULL DEFAULT 0,
    "colorScheme" INTEGER NOT NULL DEFAULT 0,
    "creativity" INTEGER NOT NULL DEFAULT 0,
    "appeal" INTEGER NOT NULL DEFAULT 0,
    "ownership" INTEGER NOT NULL DEFAULT 0,
    "miscellaneousScore" INTEGER NOT NULL DEFAULT 0,
    "judgedById" TEXT,
    "wallpaperStatus" "WallpaperStatus" NOT NULL DEFAULT 'SUBMITTED',
    "rejectedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WallpaperResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTPCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "OTPType" NOT NULL DEFAULT 'EMAIL_VERIFICATION',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTPCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "accessTokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "refreshTokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_isVerified_idx" ON "User"("isVerified");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_lastParticipatedContestId_idx" ON "User"("lastParticipatedContestId");

-- CreateIndex
CREATE INDEX "Contest_contestStatus_idx" ON "Contest"("contestStatus");

-- CreateIndex
CREATE INDEX "Contest_contestType_idx" ON "Contest"("contestType");

-- CreateIndex
CREATE INDEX "Contest_startTime_idx" ON "Contest"("startTime");

-- CreateIndex
CREATE INDEX "Contest_endTime_idx" ON "Contest"("endTime");

-- CreateIndex
CREATE INDEX "Contest_createdAt_idx" ON "Contest"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContestResult_contestId_key" ON "ContestResult"("contestId");

-- CreateIndex
CREATE INDEX "ContestResult_contestId_idx" ON "ContestResult"("contestId");

-- CreateIndex
CREATE INDEX "ContestResult_firstPlaceUserId_idx" ON "ContestResult"("firstPlaceUserId");

-- CreateIndex
CREATE INDEX "ContestResult_secondPlaceUserId_idx" ON "ContestResult"("secondPlaceUserId");

-- CreateIndex
CREATE INDEX "ContestResult_thirdPlaceUserId_idx" ON "ContestResult"("thirdPlaceUserId");

-- CreateIndex
CREATE INDEX "ContestResult_firstPlaceWallpaperId_idx" ON "ContestResult"("firstPlaceWallpaperId");

-- CreateIndex
CREATE INDEX "ContestResult_secondPlaceWallpaperId_idx" ON "ContestResult"("secondPlaceWallpaperId");

-- CreateIndex
CREATE INDEX "ContestResult_thirdPlaceWallpaperId_idx" ON "ContestResult"("thirdPlaceWallpaperId");

-- CreateIndex
CREATE INDEX "ContestResult_createdAt_idx" ON "ContestResult"("createdAt");

-- CreateIndex
CREATE INDEX "Wallpaper_isContestWallpaper_idx" ON "Wallpaper"("isContestWallpaper");

-- CreateIndex
CREATE INDEX "Wallpaper_isFeatured_idx" ON "Wallpaper"("isFeatured");

-- CreateIndex
CREATE INDEX "Wallpaper_submittedAt_idx" ON "Wallpaper"("submittedAt");

-- CreateIndex
CREATE INDEX "Wallpaper_overallRating_idx" ON "Wallpaper"("overallRating");

-- CreateIndex
CREATE INDEX "Wallpaper_publicRating_idx" ON "Wallpaper"("publicRating");

-- CreateIndex
CREATE INDEX "Wallpaper_createdAt_idx" ON "Wallpaper"("createdAt");

-- CreateIndex
CREATE INDEX "Wallpaper_orientation_idx" ON "Wallpaper"("orientation");

-- CreateIndex
CREATE INDEX "Wallpaper_isLiveWallpaper_idx" ON "Wallpaper"("isLiveWallpaper");

-- CreateIndex
CREATE INDEX "Wallpaper_isAudioEnabled_idx" ON "Wallpaper"("isAudioEnabled");

-- CreateIndex
CREATE INDEX "Wallpaper_tags_idx" ON "Wallpaper"("tags");

-- CreateIndex
CREATE INDEX "Wallpaper_submittedById_idx" ON "Wallpaper"("submittedById");

-- CreateIndex
CREATE INDEX "Wallpaper_contestId_idx" ON "Wallpaper"("contestId");

-- CreateIndex
CREATE UNIQUE INDEX "WallpaperResult_wallpaperId_key" ON "WallpaperResult"("wallpaperId");

-- CreateIndex
CREATE INDEX "WallpaperResult_wallpaperStatus_idx" ON "WallpaperResult"("wallpaperStatus");

-- CreateIndex
CREATE INDEX "WallpaperResult_overallRating_idx" ON "WallpaperResult"("overallRating");

-- CreateIndex
CREATE INDEX "WallpaperResult_createdAt_idx" ON "WallpaperResult"("createdAt");

-- CreateIndex
CREATE INDEX "WallpaperResult_wallpaperId_idx" ON "WallpaperResult"("wallpaperId");

-- CreateIndex
CREATE INDEX "WallpaperResult_judgedById_idx" ON "WallpaperResult"("judgedById");

-- CreateIndex
CREATE INDEX "OTPCode_userId_idx" ON "OTPCode"("userId");

-- CreateIndex
CREATE INDEX "OTPCode_code_idx" ON "OTPCode"("code");

-- CreateIndex
CREATE INDEX "OTPCode_expiresAt_idx" ON "OTPCode"("expiresAt");

-- CreateIndex
CREATE INDEX "OTPCode_isUsed_idx" ON "OTPCode"("isUsed");

-- CreateIndex
CREATE INDEX "OTPCode_type_idx" ON "OTPCode"("type");

-- CreateIndex
CREATE INDEX "OTPCode_createdAt_idx" ON "OTPCode"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Session_accessToken_key" ON "Session"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_accessToken_idx" ON "Session"("accessToken");

-- CreateIndex
CREATE INDEX "Session_refreshToken_idx" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_isActive_idx" ON "Session"("isActive");

-- CreateIndex
CREATE INDEX "Session_refreshTokenExpiresAt_idx" ON "Session"("refreshTokenExpiresAt");

-- CreateIndex
CREATE INDEX "Session_createdAt_idx" ON "Session"("createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lastParticipatedContestId_fkey" FOREIGN KEY ("lastParticipatedContestId") REFERENCES "Contest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestResult" ADD CONSTRAINT "ContestResult_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestResult" ADD CONSTRAINT "ContestResult_firstPlaceUserId_fkey" FOREIGN KEY ("firstPlaceUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestResult" ADD CONSTRAINT "ContestResult_secondPlaceUserId_fkey" FOREIGN KEY ("secondPlaceUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestResult" ADD CONSTRAINT "ContestResult_thirdPlaceUserId_fkey" FOREIGN KEY ("thirdPlaceUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestResult" ADD CONSTRAINT "ContestResult_firstPlaceWallpaperId_fkey" FOREIGN KEY ("firstPlaceWallpaperId") REFERENCES "Wallpaper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestResult" ADD CONSTRAINT "ContestResult_secondPlaceWallpaperId_fkey" FOREIGN KEY ("secondPlaceWallpaperId") REFERENCES "Wallpaper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestResult" ADD CONSTRAINT "ContestResult_thirdPlaceWallpaperId_fkey" FOREIGN KEY ("thirdPlaceWallpaperId") REFERENCES "Wallpaper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallpaper" ADD CONSTRAINT "Wallpaper_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallpaper" ADD CONSTRAINT "Wallpaper_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WallpaperResult" ADD CONSTRAINT "WallpaperResult_wallpaperId_fkey" FOREIGN KEY ("wallpaperId") REFERENCES "Wallpaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WallpaperResult" ADD CONSTRAINT "WallpaperResult_judgedById_fkey" FOREIGN KEY ("judgedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OTPCode" ADD CONSTRAINT "OTPCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
