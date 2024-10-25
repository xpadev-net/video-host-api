-- DropIndex
DROP INDEX `idx_session_token` ON `Session`;

-- AlterTable
ALTER TABLE `Movie` ADD COLUMN `duration` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `idx_session_token` ON `Session`(`token`(1024));
