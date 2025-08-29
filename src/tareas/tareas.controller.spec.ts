import { Test, TestingModule } from '@nestjs/testing';
import { TareasController } from './tareas.controller.js';
import { TareasService } from './tareas.service.js';

describe('TareasController', () => {
  let controller: TareasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TareasController],
      providers: [TareasService],
    }).compile();

    controller = module.get<TareasController>(TareasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
