import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import type { UserDto } from './dto/user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    // property assignment is done by TypeScript automatically
    // no need for:
    // this.appService = appService;
    // Requires an access modifier (private, public, or protected)
  }

  @Get('/users')
  getUsers(@Query('age') age?: number): UserDto[] {
    return this.appService.getUsers(age);
  }

  @Get('/user/:id')
  getId(@Param('id') id: number): UserDto {
    return this.appService.getId(id);
  }

  @Post()
  createUser(@Body() UserDto: UserDto): UserDto {
    return this.appService.createUser(UserDto);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UserDto,
  ): UserDto | { message: string } {
    return this.appService.updateUser({ ...updateUserDto, id: +id });
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): { message: string } {
    return this.appService.deleteUser(+id);
  }
}
