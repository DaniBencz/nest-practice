import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AppService {
  private users: UserDto[] = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Charlie', age: 35 },
  ];

  async getUsers(age?: number): Promise<UserDto[]> {
    if (age) {
      const res = this.users.filter((user) => user.age === age);

      if (res.length > 0) {
        return Promise.resolve(res);
      }
      throw new Error('No users found with the specified age');
    }
    return this.users;
  }

  async getId(id: number): Promise<UserDto> {
    const user = this.users.find((user) => user.id === id);

    if (user) {
      return Promise.resolve(user);
    }
    throw new Error('No user found with the specified ID');
  }

  async createUser(userDto: UserDto): Promise<UserDto> {
    const newUser: UserDto = {
      id: this.users.length + 1,
      name: userDto.name,
      age: userDto.age ?? 30,
    };

    this.users.push(newUser);
    return Promise.resolve(newUser);
  }

  async updateUser(UserDto: UserDto): Promise<UserDto> {
    const userIndex = this.users.findIndex((user) => user.id === UserDto.id);

    if (userIndex !== -1) {
      this.users[userIndex].name = UserDto.name;
      this.users[userIndex].age = UserDto.age
        ? UserDto.age
        : this.users[userIndex].age;

      return Promise.resolve(this.users[userIndex]);
    }
    throw new Error('No user found with the specified ID');
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return Promise.resolve({ message: 'User deleted' });
    }
    throw new Error('No user found with the specified ID');
  }
}
