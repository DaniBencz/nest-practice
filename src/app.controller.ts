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
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './dto/user.dto';
import { AdminGuard } from './admin/admin.guard';

@Controller('users')
export class AppController {
  // Requires an access modifier (private, public, or protected)
  constructor(private readonly appService: AppService) {
    // property assignment is done by TypeScript automatically
    // no need for:
    // this.appService = appService;
  }

  @Get()
  getUsers(
    // ParseIntPipe converts 'age' query param (string) to number
    @Query('age', new ParseIntPipe({ optional: true })) age?: number,
  ): Promise<UserDto[]> {
    return this.appService.getUsers(age);
  }

  @Get(':id')
  getId(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.appService.getId(id);
  }

  @Post()
  // ValidationPipe makes use of the class-validator decorators in UserDto
  createUser(@Body(new ValidationPipe()) userDto: UserDto): Promise<UserDto> {
    return this.appService.createUser(userDto);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UserDto,
  ): Promise<UserDto> | { message: string } {
    return this.appService.updateUser({ ...updateUserDto, id });
  }

  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.appService.deleteUser(id);
  }
}
