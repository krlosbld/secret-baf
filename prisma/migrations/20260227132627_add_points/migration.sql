-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Secret" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revealed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Secret" ("content", "createdAt", "id", "name", "revealed") SELECT "content", "createdAt", "id", "name", "revealed" FROM "Secret";
DROP TABLE "Secret";
ALTER TABLE "new_Secret" RENAME TO "Secret";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
