import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';

const reqMock = {
  user: {
    userId: 1,
  },
};

describe('AccountsController', () => {
  let controller: AccountsController;

  const service = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findOneByUser: jest.fn(),
    updateByUser: jest.fn(),
    removeByUser: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        AccountsService,
        {
          provide: AccountsService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an account for user', async () => {
    const dto = {
      accountNumber: '123456',
      balance: 1000,
      type: 'savings',
    };
    const resultMock = {
      id: 1,
      userId: 1,
      ...dto,
    };

    service.create.mockResolvedValue(resultMock);
    const result = await controller.create(
      reqMock as any,
      dto as CreateAccountDto,
    );
    expect(result).toEqual(resultMock);
    expect(service.create).toHaveBeenCalledWith(1, dto as any);
  });

  it('should return all accounts by user', async () => {
    const resultMock = [{ id: 1 }, { id: 2 }];
    service.findAllByUser.mockResolvedValue(resultMock);
    const result = await controller.findAll(reqMock as any);
    expect(result).toEqual(resultMock);
    expect(service.findAllByUser).toHaveBeenCalledWith(1);
  });

  it('should return an account by user', async () => {
    const accountId = 1;
    const resultMock = { id: accountId, userId: 1 };
    service.findOneByUser.mockResolvedValue(resultMock);
    const result = await controller.findOne(reqMock as any, accountId);
    expect(result).toEqual(resultMock);
    expect(service.findOneByUser).toHaveBeenCalledWith(1, accountId);
  });

  it('should update an account by user', async () => {
    const accountId = 1;
    const dto = { balance: 2000 };
    const resultMock = { id: accountId, userId: 1, ...dto };
    service.updateByUser.mockResolvedValue(resultMock);
    const result = await controller.update(reqMock as any, accountId, dto);
    expect(result).toEqual(resultMock);
    expect(service.updateByUser).toHaveBeenCalledWith(1, accountId, dto);
  });
  it('should remove an account by user', async () => {
    const accountId = 1;
    const resultMock = { id: accountId, userId: 1 };
    service.removeByUser.mockResolvedValue(resultMock);
    const result = await controller.remove(reqMock as any, accountId);
    expect(result).toEqual(resultMock);
    expect(service.removeByUser).toHaveBeenCalledWith(1, accountId);
  });
});
