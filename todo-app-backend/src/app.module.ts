import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ToDoModule } from './todo.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://zohaibshahid200:2myZsfPyWiKjsiVa@todoapp.ezzpj.mongodb.net/?retryWrites=true&w=majority&appName=ToDoApp'),
    ToDoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
