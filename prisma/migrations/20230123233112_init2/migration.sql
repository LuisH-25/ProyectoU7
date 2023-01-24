/*
  Warnings:

  - You are about to drop the column `status` on the `Song` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Song" ("album", "artist", "duration", "genre", "id", "name", "year") SELECT "album", "artist", "duration", "genre", "id", "name", "year" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
