-- CreateTable
CREATE TABLE "CardImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "evoUrl" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Encounter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "opponentId" INTEGER NOT NULL,
    "deck" JSONB NOT NULL,
    "playedAt" DATETIME NOT NULL,
    CONSTRAINT "Encounter_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Opponent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Encounter" ("deck", "id", "opponentId", "playedAt") SELECT "deck", "id", "opponentId", "playedAt" FROM "Encounter";
DROP TABLE "Encounter";
ALTER TABLE "new_Encounter" RENAME TO "Encounter";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CardImage_name_key" ON "CardImage"("name");
