import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TareasModule } from './tareas/tareas.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [TareasModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
