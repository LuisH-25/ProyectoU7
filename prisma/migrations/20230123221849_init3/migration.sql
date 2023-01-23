/*
  Warnings:

  - You are about to drop the `Playlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistSongs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "PlaylistSongs_id_song_id_playlist_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Playlist";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PlaylistSongs";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PlaylistS" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "PlaylistS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PlaylistToSong" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PlaylistToSong_A_fkey" FOREIGN KEY ("A") REFERENCES "PlaylistS" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PlaylistToSong_B_fkey" FOREIGN KEY ("B") REFERENCES "Song" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "last_session" DATETIME,
    "update_at" DATETIME NOT NULL,
    "date_born" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("date_born", "email", "id", "last_session", "name", "password", "update_at") SELECT "date_born", "email", "id", "last_session", "name", "password", "update_at" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_PlaylistToSong_AB_unique" ON "_PlaylistToSong"("A", "B");

-- CreateIndex
CREATE INDEX "_PlaylistToSong_B_index" ON "_PlaylistToSong"("B");
