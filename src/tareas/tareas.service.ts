import { Injectable } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TareasService {

  constructor(
    private prisma: PrismaService
  ) {}

  create(body: any) {
    return this.prisma.tarea.create({
      data: body
    })
  }

  findAll() {
    return this.prisma.tarea.findMany({
      orderBy: {name: 'desc'}
    });
     
  }

  findOne(id: number) {
      return this.prisma.tarea.findFirst({
        where:{ id: id }
      })
  }

  async update(id: number, 
       body: any ) {
   return await this.prisma.tarea.update({
    where: {id: id},
    data: body
   });
  }

  async remove(id: number) {
    await this.prisma.tarea.delete({
      where: { id: id }
    })
    return{
      "exito": true,
      "mensaje" : "Eliminado correctamente",
      "id" : id
    }
  }
}
