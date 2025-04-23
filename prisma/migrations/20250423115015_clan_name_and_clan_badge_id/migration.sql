/*
  Warnings:

  - Added the required column `badgeId` to the `Clan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Clan` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Clan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "badgeId" INTEGER NOT NULL
);
INSERT INTO "new_Clan" ("id", "tag") SELECT "id", "tag" FROM "Clan";
DROP TABLE "Clan";
ALTER TABLE "new_Clan" RENAME TO "Clan";
CREATE UNIQUE INDEX "Clan_tag_key" ON "Clan"("tag");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
