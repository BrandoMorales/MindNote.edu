import { Module } from '@nestjs/common';
import { TareasService } from './tareas.service.js';
import { TareasController } from './tareas.controller.js';
import { PrismaModule } from 'backend/src/prisma/prisma.module.js';

@Module({
  imports:[PrismaModule],
  controllers: [TareasController],
  providers: [TareasService],
})
export class TareasModule {}