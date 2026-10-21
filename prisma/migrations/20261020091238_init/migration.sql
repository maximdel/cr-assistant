-- CreateTable
CREATE TABLE "Preset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastSeen" DATETIME NOT NULL,
    "clanId" INTEGER,
    CONSTRAINT "Player_clanId_fkey" FOREIGN KEY ("clanId") REFERENCES "Clan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Clan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "badgeId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Encounter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "myTag" TEXT NOT NULL,
    "opponentId" INTEGER NOT NULL,
    "playedAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "gameMode" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "myCrowns" INTEGER NOT NULL,
    "opponentCrowns" INTEGER NOT NULL,
    "trophyChange" INTEGER,
    "myDeck" JSONB NOT NULL,
    "opponentDeck" JSONB NOT NULL,
    "raw" JSONB NOT NULL,
    CONSTRAINT "Encounter_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CardImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "evoUrl" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Preset_tag_key" ON "Preset"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "Player_tag_key" ON "Player"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "Clan_tag_key" ON "Clan"("tag");

-- CreateIndex
CREATE INDEX "Encounter_myTag_playedAt_idx" ON "Encounter"("myTag", "playedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Encounter_myTag_opponentId_playedAt_key" ON "Encounter"("myTag", "opponentId", "playedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CardImage_name_key" ON "CardImage"("name");
