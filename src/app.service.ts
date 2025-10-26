import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
@Injectable()
export class AppService {
  private users: UserDto[] = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Charlie', age: 35 },
  ];

  getUsers(age?: number): UserDto[] {
    if (age) {
      const res = this.users.filter((user) => user.age === age);
      if (res.length > 0) {
        return res;
      }
      throw new Error('No users found with the specified age');
    }
    return this.users;
  }

  getId(id: number): UserDto {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error('No user found with the specified ID');
  }

  createUser(userDto: UserDto): UserDto {
    const newUser: UserDto = {
      id: this.users.length + 1,
      name: userDto.name,
      age: userDto.age ?? 30,
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(UserDto: UserDto): UserDto {
    const userIndex = this.users.findIndex((user) => user.id === UserDto.id);
    if (userIndex !== -1) {
      this.users[userIndex].name = UserDto.name;
      this.users[userIndex].age = UserDto.age
        ? UserDto.age
        : this.users[userIndex].age;
      return this.users[userIndex];
    }
    throw new Error('No user found with the specified ID');
  }

  deleteUser(id: number): { message: string } {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return { message: 'User deleted' };
    }
    throw new Error('No user found with the specified ID');
  }
}
