-- CreateTable
CREATE TABLE "CliAuth" (
    "id" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CliAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CliAuth_refreshToken_key" ON "CliAuth"("refreshToken");

-- CreateIndex
CREATE INDEX "CliAuth_userId_idx" ON "CliAuth"("userId");

-- AddForeignKey
ALTER TABLE "CliAuth" ADD CONSTRAINT "CliAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
