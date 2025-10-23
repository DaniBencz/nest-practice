import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { AppService } from './app.service';
import type { CreateHelloDto } from './dto/hello.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':id')
  getId(@Param('id') id: string): string {
    return this.appService.getId(id);
  }

  @Post()
  createHello(@Body() createHelloDto: CreateHelloDto): string {
    return `${createHelloDto.name} is created!`;
  }

  @Put(':id')
  updateHello(
    @Param('id') id: string,
    @Body() updateHelloDto: CreateHelloDto,
  ): string {
    return `Hello with ID ${id} is updated to ${updateHelloDto.name}`;
  }

  @Delete(':id')
  deleteHello(@Param('id') id: string): string {
    return `Hello with ID ${id} is deleted!`;
  }
}
