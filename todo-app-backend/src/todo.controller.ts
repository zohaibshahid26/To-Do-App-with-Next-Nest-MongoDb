import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.schema';

@Controller('todos')
/**
 * Controller class for handling Todo operations.
 */
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Post()
  async create(@Body() todo: Todo): Promise<Todo> {
    return this.todoService.create(todo);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() todo: Todo): Promise<Todo> {
    return this.todoService.update(id, todo);
  }
  @Delete(':_id')
  async delete(@Param('_id') _id: string): Promise<Todo> {
    console.log('Received _id:', _id); // Add this line
    return this.todoService.delete(_id);
  }
  
}
