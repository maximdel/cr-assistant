/*
  Warnings:

  - You are about to drop the `Opponent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Opponent_tag_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Opponent";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastSeen" DATETIME NOT NULL,
    "clanId" INTEGER NOT NULL,
    CONSTRAINT "Player_clanId_fkey" FOREIGN KEY ("clanId") REFERENCES "Clan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Clan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Encounter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "opponentId" INTEGER NOT NULL,
    "deck" JSONB NOT NULL,
    "playedAt" DATETIME NOT NULL,
    CONSTRAINT "Encounter_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Encounter" ("deck", "id", "opponentId", "playedAt") SELECT "deck", "id", "opponentId", "playedAt" FROM "Encounter";
DROP TABLE "Encounter";
ALTER TABLE "new_Encounter" RENAME TO "Encounter";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Player_tag_key" ON "Player"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "Clan_tag_key" ON "Clan"("tag");
