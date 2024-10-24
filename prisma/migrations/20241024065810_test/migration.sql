-- CreateIndex
CREATE INDEX `idx_session_token` ON `Session`(`token`(1024));
