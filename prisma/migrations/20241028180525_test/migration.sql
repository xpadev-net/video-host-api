-- DropIndex
DROP INDEX `idx_session_token` ON `Session`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `avatarUrl` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `idx_session_token` ON `Session`(`token`(1024));
