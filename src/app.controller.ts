import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {
    // property assignment is done by TypeScript automatically
    // no need for:
    // this.appService = appService;
    // Requires an access modifier (private, public, or protected)
  }

  @Get()
  getUsers(
    @Query('age', new ParseIntPipe({ optional: true })) age?: number,
  ): UserDto[] {
    return this.appService.getUsers(age);
  }

  @Get(':id')
  getId(@Param('id', ParseIntPipe) id: number): UserDto {
    return this.appService.getId(id);
  }

  @Post()
  // ValidationPipe makes use of the class-validator decorators in UserDto
  createUser(@Body(new ValidationPipe()) userDto: UserDto): UserDto {
    return this.appService.createUser(userDto);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UserDto,
  ): UserDto | { message: string; } {
    return this.appService.updateUser({ ...updateUserDto, id });
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): { message: string; } {
    return this.appService.deleteUser(id);
  }
}
