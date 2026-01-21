-- AlterTable
ALTER TABLE "sites" ADD COLUMN     "rich_content" TEXT;

-- CreateTable
CREATE TABLE "site_visits" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "device_type" TEXT NOT NULL,
    "visit_date" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "site_visits_site_id_device_type_visit_date_key" ON "site_visits"("site_id", "device_type", "visit_date");

-- AddForeignKey
ALTER TABLE "site_visits" ADD CONSTRAINT "site_visits_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
