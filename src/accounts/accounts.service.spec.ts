import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { AccountRepository } from './accounts.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { BadRequestException } from '@nestjs/common';

describe('AccountsService', () => {
  let service: AccountsService;
  let repo: jest.Mocked<AccountRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: AccountRepository,
          useValue: {
            createUserAccount: jest.fn(),
            findUserAccounts: jest.fn(),
            findUserAccount: jest.fn(),
            updateUserAccount: jest.fn(),
            removeUserAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    repo = module.get(AccountRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create account for user', async () => {
    const userId = 1;
    const dto = {
      accountNumber: '123456',
      balance: 1000,
      type: 'savings',
    };

    const resultMock = {
      id: 1,
      userId,
      ...dto,
    };

    repo.createUserAccount.mockResolvedValue(resultMock);

    const result = await service.create(userId, dto as CreateAccountDto);

    expect(result).toEqual(resultMock);
    expect(repo.createUserAccount).toHaveBeenCalledWith(userId, dto);
  });

  it('should not create account if account number already exists', async () => {
    repo.createUserAccount.mockRejectedValue(
      new BadRequestException('Account number already exists'),
    );

    await expect(
      service.create(1, {
        accountNumber: '123456',
        balance: 1000,
        type: 'savings',
      } as CreateAccountDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return all accounts by user', async () => {
    const userId = 1;
    const accounts = [
      { id: 1, userId, accountNumber: '123456' },
      { id: 2, userId, accountNumber: '654321' },
    ];

    repo.findUserAccounts.mockResolvedValue(accounts);

    const result = await service.findAllByUser(userId);

    expect(result).toEqual(accounts);
    expect(repo.findUserAccounts).toHaveBeenCalledWith(userId);
  });

  it('should return a specific account by user', async () => {
    const userId = 1;
    const accountId = 2;
    const account = { id: accountId, userId, accountNumber: '654321' };

    repo.findUserAccount.mockResolvedValue(account);

    const result = await service.findOneByUser(userId, accountId);

    expect(result).toEqual(account);
    expect(repo.findUserAccount).toHaveBeenCalledWith(userId, accountId);
  });

  it('should update an account by user', async () => {
    const userId = 1;
    const accountId = 2;
    const dto = { balance: 2000 };

    repo.updateUserAccount.mockResolvedValue({ id: accountId, ...dto });

    const result = await service.updateByUser(userId, accountId, dto);

    expect(result).toEqual({ id: accountId, ...dto });
    expect(repo.updateUserAccount).toHaveBeenCalledWith(userId, accountId, dto);
  });

  it('should not update account if unauthorized', async () => {
    repo.updateUserAccount.mockRejectedValue(
      new BadRequestException('Unauthorized access'),
    );

    await expect(service.updateByUser(2, 1, { balance: 2000 })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should remove an account by user', async () => {
    const userId = 1;
    const accountId = 2;

    repo.removeUserAccount.mockResolvedValue({ id: accountId });

    const result = await service.removeByUser(userId, accountId);

    expect(result).toEqual({ id: accountId });
    expect(repo.removeUserAccount).toHaveBeenCalledWith(userId, accountId);
  });

  it('should not remove account if unauthorized', async () => {
    repo.removeUserAccount.mockRejectedValue(
      new BadRequestException('Unauthorized access'),
    );

    await expect(service.removeByUser(2, 1)).rejects.toThrow(
      BadRequestException,
    );
  });
});
