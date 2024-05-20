-- CreateTable
CREATE TABLE "IotMeasurement" (
    "id" SERIAL NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "base64Encode" TEXT NOT NULL,
    "gas" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IotMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" SERIAL NOT NULL,
    "measureId" INTEGER NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Incident_measureId_key" ON "Incident"("measureId");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_measureId_fkey" FOREIGN KEY ("measureId") REFERENCES "IotMeasurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
