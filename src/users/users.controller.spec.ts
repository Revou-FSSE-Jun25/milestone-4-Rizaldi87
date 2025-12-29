import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('UsersController', () => {
  let controller: UsersController;

  const usersServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }) // 🔑 bypass auth & roles
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user profile from request', () => {
    const req = {
      user: { userId: 1, email: 'test@mail.com' },
    };

    const result = controller.getProfile(req as any);

    expect(result).toEqual(req.user);
  });

  // ================= UPDATE PROFILE =================
  it('should update logged-in user profile', async () => {
    const req = {
      user: { userId: 1 },
    };

    const dto = { name: 'Updated Name' };
    const updatedUser = { id: 1, name: 'Updated Name' };

    usersServiceMock.update.mockResolvedValue(updatedUser);

    const result = await controller.updateProfile(req as any, dto as any);

    expect(usersServiceMock.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(updatedUser);
  });

  // ================= FIND ALL =================
  it('should return all users', async () => {
    const users = [{ id: 1 }, { id: 2 }];

    usersServiceMock.findAll.mockResolvedValue(users);

    const result = await controller.findAll();

    expect(usersServiceMock.findAll).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  // ================= FIND ONE =================
  it('should return user by id', async () => {
    const user = { id: 1 };

    usersServiceMock.findOne.mockResolvedValue(user);

    const result = await controller.findOne('1');

    expect(usersServiceMock.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(user);
  });

  it('should throw NotFoundException when user not found', async () => {
    usersServiceMock.findOne.mockRejectedValue(new Error('User not found'));

    await expect(controller.findOne('99')).rejects.toThrow();
  });
});
