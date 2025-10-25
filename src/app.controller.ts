import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  NotFoundException,
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

  @Get()
  getUsers(@Query() query: { age?: string }): UserDto[] {
    try {
      if (query.age) {
        return this.appService.getUsers(+query.age);
      }
      return this.appService.getUsers();
    } catch (error: unknown) {
      throw new NotFoundException((error as Error).message);
    }
  }

  @Get(':id')
  getId(@Param('id') id: string): UserDto | { message: string } {
    try {
      return this.appService.getId(+id);
    } catch (error: unknown) {
      throw new NotFoundException((error as Error).message);
    }
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
    try {
      return this.appService.updateUser({ ...updateUserDto, id: +id });
    } catch (error: unknown) {
      throw new NotFoundException((error as Error).message);
    }
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): { message: string } {
    try {
      return this.appService.deleteUser(+id);
    } catch (error: unknown) {
      throw new NotFoundException((error as Error).message);
    }
  }
}
