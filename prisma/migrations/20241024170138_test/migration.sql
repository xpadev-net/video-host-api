-- DropIndex
DROP INDEX `idx_session_token` ON `Session`;

-- AlterTable
ALTER TABLE `Movie` ADD COLUMN `visibility` ENUM('PUBLIC', 'UNLISTED', 'PRIVATE') NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE `Series` ADD COLUMN `visibility` ENUM('PUBLIC', 'UNLISTED', 'PRIVATE') NOT NULL DEFAULT 'PUBLIC';

-- CreateIndex
CREATE INDEX `idx_session_token` ON `Session`(`token`(1024));
