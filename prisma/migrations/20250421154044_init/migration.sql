-- CreateTable
CREATE TABLE "Opponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastSeen" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Encounter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "opponentId" INTEGER NOT NULL,
    "deck" JSONB NOT NULL,
    "playedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Encounter_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Opponent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Opponent_tag_key" ON "Opponent"("tag");
