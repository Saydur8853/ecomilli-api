-- DropIndex
DROP INDEX `categories_catAddedById_fkey` ON `categories`;

-- DropIndex
DROP INDEX `comments_newsId_fkey` ON `comments`;

-- DropIndex
DROP INDEX `comments_updatedById_fkey` ON `comments`;

-- DropIndex
DROP INDEX `cron_settings_cronAddedById_fkey` ON `cron_settings`;

-- DropIndex
DROP INDEX `infobites_updatedById_fkey` ON `infobites`;

-- DropIndex
DROP INDEX `News_addedById_fkey` ON `news`;

-- DropIndex
DROP INDEX `News_catId_fkey` ON `news`;

-- DropIndex
DROP INDEX `News_updatedById_fkey` ON `news`;

-- DropIndex
DROP INDEX `news_images_newsId_fkey` ON `news_images`;

-- DropIndex
DROP INDEX `tags_newsId_fkey` ON `tags`;

-- DropIndex
DROP INDEX `users_roleId_fkey` ON `users`;

-- AlterTable
ALTER TABLE `news` MODIFY `addedById` INTEGER NULL,
    MODIFY `updatedById` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `infobites` ADD CONSTRAINT `infobites_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cron_settings` ADD CONSTRAINT `cron_settings_cronAddedById_fkey` FOREIGN KEY (`cronAddedById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_catAddedById_fkey` FOREIGN KEY (`catAddedById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_catId_fkey` FOREIGN KEY (`catId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_addedById_fkey` FOREIGN KEY (`addedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_images` ADD CONSTRAINT `news_images_newsId_fkey` FOREIGN KEY (`newsId`) REFERENCES `News`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tags` ADD CONSTRAINT `tags_newsId_fkey` FOREIGN KEY (`newsId`) REFERENCES `News`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_newsId_fkey` FOREIGN KEY (`newsId`) REFERENCES `News`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
