import { Injectable } from '@nestjs/common';
import type { UserDto } from './dto/user.dto';
@Injectable()
export class AppService {
  private users: UserDto[] = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Charlie', age: 35 },
  ];

  getUsers(age?: number): UserDto[] {
    if (age) {
      return this.users.filter((user) => user.age === age);
    }
    return this.users;
  }

  getId(id: number): UserDto | { message: string } {
    const user = this.users.find((user) => user.id === id);
    return user ? user : { message: 'User not found' };
  }

  createUser(UserDto: UserDto): UserDto {
    const newUser: UserDto = {
      id: this.users.length + 1,
      name: UserDto.name,
      age: UserDto.age ? UserDto.age : 30,
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(UserDto: UserDto): UserDto | { message: string } {
    const userIndex = this.users.findIndex((user) => user.id === UserDto.id);
    if (userIndex !== -1) {
      this.users[userIndex].name = UserDto.name;
      this.users[userIndex].age = UserDto.age
        ? UserDto.age
        : this.users[userIndex].age;
      return this.users[userIndex];
    }
    return { message: 'User not found' };
  }

  deleteUser(id: number): { message: string } {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return { message: 'User deleted' };
    }
    return { message: 'User not found' };
  }
}
