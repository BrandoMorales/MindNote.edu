import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  create(@Body() body:any) {
    return this.tareasService.create(body);
  }

  @Get()
  findAll() {
    return this.tareasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tareasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param("id") id: string,
  @Body() body: any ) {
    return {
       "exito" : true,
       "mesaje" : "Actualizado correctamente",
       "id" : id,
       "data": this.
               tareasService.
               update(+id, body)
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tareasService.remove(+id);
  }
}
