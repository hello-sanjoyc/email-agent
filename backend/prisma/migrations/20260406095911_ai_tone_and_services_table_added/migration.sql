-- CreateTable
CREATE TABLE "ai_tones" (
    "id" UUID NOT NULL,
    "tone" "AIResponseTone" NOT NULL DEFAULT 'PROFESSIONAL',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_tones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_services" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_services_name_key" ON "ai_services"("name");
