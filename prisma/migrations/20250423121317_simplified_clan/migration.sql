-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastSeen" DATETIME NOT NULL,
    "clanId" INTEGER,
    CONSTRAINT "Player_clanId_fkey" FOREIGN KEY ("clanId") REFERENCES "Clan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("clanId", "id", "lastSeen", "name", "tag") SELECT "clanId", "id", "lastSeen", "name", "tag" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_tag_key" ON "Player"("tag");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
