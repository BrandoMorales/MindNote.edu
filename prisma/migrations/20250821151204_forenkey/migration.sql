/*
  Warnings:

  - Added the required column `tarea_id` to the `notas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notas` ADD COLUMN `tarea_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `notas` ADD CONSTRAINT `notas_tarea_id_fkey` FOREIGN KEY (`tarea_id`) REFERENCES `tarea`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
