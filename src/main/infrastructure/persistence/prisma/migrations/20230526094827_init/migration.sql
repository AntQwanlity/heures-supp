-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('lawyer', 'employee');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "user_type" "UserType" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "firebase_user" (
    "user_id" UUID NOT NULL,
    "firebase_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "firebase_user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "lawyer" (
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "lawyer_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "client" (
    "user_id" UUID NOT NULL,
    "sex" "Sex",
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "legal_case" (
    "id" UUID NOT NULL,
    "lawyer_id" UUID NOT NULL,
    "client_id" UUID,
    "weekly_hours" INTEGER NOT NULL,
    "starts_at" TIMESTAMPTZ NOT NULL,
    "ends_at" TIMESTAMPTZ NOT NULL,
    "base_monthly_salary" INTEGER NOT NULL,
    "magic_link_token" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "legal_case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary" (
    "id" UUID NOT NULL,
    "legal_case_id" UUID NOT NULL,
    "date" TIMESTAMPTZ NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "salary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worked_day" (
    "id" UUID NOT NULL,
    "legal_case_id" UUID NOT NULL,
    "morning_starts_at" TIMESTAMPTZ NOT NULL,
    "morning_ends_at" TIMESTAMPTZ NOT NULL,
    "afternoon_starts_at" TIMESTAMPTZ NOT NULL,
    "afternoon_ends_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "worked_day_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "firebase_user_firebase_id_key" ON "firebase_user"("firebase_id");

-- CreateIndex
CREATE INDEX "firebase_user_firebase_id_idx" ON "firebase_user"("firebase_id");

-- CreateIndex
CREATE UNIQUE INDEX "legal_case_lawyer_id_client_id_key" ON "legal_case"("lawyer_id", "client_id");

-- AddForeignKey
ALTER TABLE "firebase_user" ADD CONSTRAINT "firebase_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lawyer" ADD CONSTRAINT "lawyer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_case" ADD CONSTRAINT "legal_case_lawyer_id_fkey" FOREIGN KEY ("lawyer_id") REFERENCES "lawyer"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_case" ADD CONSTRAINT "legal_case_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary" ADD CONSTRAINT "salary_legal_case_id_fkey" FOREIGN KEY ("legal_case_id") REFERENCES "legal_case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worked_day" ADD CONSTRAINT "worked_day_legal_case_id_fkey" FOREIGN KEY ("legal_case_id") REFERENCES "legal_case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
