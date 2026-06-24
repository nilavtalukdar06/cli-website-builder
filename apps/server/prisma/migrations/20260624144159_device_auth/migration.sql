-- CreateTable
CREATE TABLE "DeviceAuth" (
    "id" TEXT NOT NULL,
    "deviceCode" TEXT NOT NULL,
    "userCode" TEXT NOT NULL,
    "authorized" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceAuth_deviceCode_key" ON "DeviceAuth"("deviceCode");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceAuth_userCode_key" ON "DeviceAuth"("userCode");

-- CreateIndex
CREATE INDEX "DeviceAuth_userId_idx" ON "DeviceAuth"("userId");

-- AddForeignKey
ALTER TABLE "DeviceAuth" ADD CONSTRAINT "DeviceAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
