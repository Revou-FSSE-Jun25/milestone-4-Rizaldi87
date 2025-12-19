import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    repo.findAll.mockResolvedValue([
      { id: 1, email: 'admin@mail.com', role: 'ADMIN' },
      { id: 2, email: 'user@mail.com', role: 'USER' },
    ]);

    const result = await service.findAll();

    expect(result).toHaveLength(2);
    expect(repo.findAll).toHaveBeenCalled();
  });

  it('should return one user by id', async () => {
    repo.findOne.mockResolvedValue({
      id: 1,
      email: 'user@mail.com',
      role: 'USER',
    });

    const result = await service.findOne(1);

    expect(result.id).toBe(1);
    expect(repo.findOne).toHaveBeenCalledWith(1);
  });

  it('should update user profile', async () => {
    repo.update.mockResolvedValue({
      id: 1,
      name: 'New Name',
    });

    const result = await service.update(1, { name: 'New Name' });

    expect(result.name).toBe('New Name');
    expect(repo.update).toHaveBeenCalledWith(1, {
      name: 'New Name',
    });
  });

  it('should throw NotFoundException if user not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });
});
