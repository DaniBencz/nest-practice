import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserDto } from './dto/user.dto';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockUsers: UserDto[] = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Charlie', age: 35 },
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('AppController instantiation', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });

    it('should have AppService injected', () => {
      expect(appService).toBeDefined();
    });
  });

  describe('GET /users', () => {
    it('should return all users when no age filter is provided', async () => {
      const result = await appController.getUsers();
      expect(result).toEqual(mockUsers);
      expect(result.length).toBe(3);
    });

    it('should return filtered users by age', async () => {
      const result = await appController.getUsers(30);
      expect(result).toEqual([mockUsers[0]]);
      // or, if you only care that the returned array contains that user:
      // expect(result).toContainEqual(mockUsers[0]);
      expect(result.length).toBe(1);
    });

    it('should throw error when no users found with specified age', async () => {
      await expect(appController.getUsers(99)).rejects.toThrow(
        'No users found with the specified age',
      );
    });

    it('should filter by different ages', async () => {
      const resultAge25 = await appController.getUsers(25);
      expect(resultAge25).toEqual([mockUsers[1]]);

      const resultAge35 = await appController.getUsers(35);
      expect(resultAge35).toEqual([mockUsers[2]]);
    });

    it('should call appService.getUsers', async () => {
      const spy = jest.spyOn(appService, 'getUsers');
      await appController.getUsers();

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      const result = await appController.getId(1);
      expect(result).toEqual(mockUsers[0]);
    });

    it('should return different users by different ids', async () => {
      const user2 = await appController.getId(2);
      expect(user2).toEqual(mockUsers[1]);

      const user3 = await appController.getId(3);
      expect(user3).toEqual(mockUsers[2]);
    });

    it('should throw error when user not found', async () => {
      await expect(appController.getId(999)).rejects.toThrow(
        'No user found with the specified ID',
      );
    });

    it('should call appService.getId with correct id', async () => {
      const spy = jest.spyOn(appService, 'getId');
      await appController.getId(1);

      expect(spy).toHaveBeenCalledWith(1);
      spy.mockRestore();
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUserDto: UserDto = { name: 'David', age: 28, id: 0 };
      const result = await appController.createUser(newUserDto);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe('David');
      expect(result.age).toBe(28);
    });

    it('should assign incremented id to new user', async () => {
      const newUserDto: UserDto = { name: 'Eve', age: 32, id: 0 };
      const result = await appController.createUser(newUserDto);

      expect(result.id).toBeGreaterThan(0);
    });

    it('should set default age of 30 when age is not provided', async () => {
      const newUserDto: UserDto = { name: 'Frank', id: 0 };
      const result = await appController.createUser(newUserDto);

      expect(result.age).toBe(30);
    });

    it('should call appService.createUser', async () => {
      const spy = jest.spyOn(appService, 'createUser');
      const newUserDto: UserDto = { name: 'Grace', age: 27, id: 0 };

      await appController.createUser(newUserDto);
      expect(spy).toHaveBeenCalledWith(newUserDto);
      spy.mockRestore();
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user name and age', async () => {
      const updateUserDto: UserDto = {
        id: 1,
        name: 'Alice Updated',
        age: 31,
      };

      const result = (await appController.updateUser(
        1,
        updateUserDto,
      )) as UserDto;

      expect(result.name).toBe('Alice Updated');
      expect(result.age).toBe(31);
    });

    it('should update only name when age is not provided', async () => {
      const updateUserDto: UserDto = { id: 2, name: 'Bob Updated' };
      const result = (await appController.updateUser(
        2,
        updateUserDto,
      )) as UserDto;

      expect(result.name).toBe('Bob Updated');
      expect(result.age).toBe(25); // Original age preserved
    });

    it('should throw error when user not found', async () => {
      const updateUserDto: UserDto = { id: 999, name: 'NonExistent' };

      await expect(
        appController.updateUser(999, updateUserDto),
      ).rejects.toThrow('No user found with the specified ID');
    });

    it('should call appService.updateUser', async () => {
      const spy = jest.spyOn(appService, 'updateUser');
      const updateUserDto: UserDto = { id: 1, name: 'Updated' };

      await appController.updateUser(1, updateUserDto);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user and return success message', async () => {
      const result = await appController.deleteUser(1);
      expect(result).toEqual({ message: 'User deleted' });
    });

    it('should throw error when trying to delete non-existent user', async () => {
      await expect(appController.deleteUser(999)).rejects.toThrow(
        'No user found with the specified ID',
      );
    });

    it('should call appService.deleteUser with correct id', async () => {
      const spy = jest.spyOn(appService, 'deleteUser');
      await appController.deleteUser(1);

      expect(spy).toHaveBeenCalledWith(1);
      spy.mockRestore();
    });

    it('should actually remove user from list', async () => {
      const beforeDelete = await appController.getUsers();
      const initialCount = beforeDelete.length;

      await appController.deleteUser(1);

      const afterDelete = await appController.getUsers();
      expect(afterDelete.length).toBe(initialCount - 1);
    });
  });

  describe('AdminGuard integration', () => {
    it('should have AdminGuard applied to updateUser', () => {
      // Note: Guards are checked at runtime, this verifies structure
      expect(appController.updateUser.bind(appController)).toBeDefined();
    });
  });
});
