import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repo: jest.Mocked<TransactionsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionsRepository,
          useValue: {
            deposit: jest.fn(),
            withdraw: jest.fn(),
            tranfer: jest.fn(),
            findAllByUser: jest.fn(),
            findOneByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repo = module.get(TransactionsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ================= DEPOSIT =================
  it('should deposit money to account', async () => {
    const resultMock = { success: true };

    repo.deposit.mockResolvedValue(resultMock);

    const result = await service.deposit(1, 10, 500);

    expect(repo.deposit).toHaveBeenCalledWith(1, 10, 500);
    expect(result).toEqual(resultMock);
  });

  // ================= WITHDRAW =================
  it('should withdraw money from account', async () => {
    const resultMock = { success: true };

    repo.withdraw.mockResolvedValue(resultMock);

    const result = await service.withdraw(1, 10, 200);

    expect(repo.withdraw).toHaveBeenCalledWith(1, 10, 200);
    expect(result).toEqual(resultMock);
  });

  // ================= TRANSFER =================
  it('should transfer money to another account', async () => {
    const resultMock = { success: true };

    repo.tranfer.mockResolvedValue(resultMock);

    const result = await service.tranfer(1, 10, 300, 20);

    expect(repo.tranfer).toHaveBeenCalledWith(1, 10, 300, 20);
    expect(result).toEqual(resultMock);
  });

  // ================= FIND ALL =================
  it('should return all transactions by user', async () => {
    const transactions = [{ id: 1 }, { id: 2 }];

    repo.findAllByUser.mockResolvedValue(transactions);

    const result = await service.findAllByUser(1);

    expect(repo.findAllByUser).toHaveBeenCalledWith(1);
    expect(result).toEqual(transactions);
  });

  // ================= FIND ONE =================
  it('should return a transaction by id for user', async () => {
    const transaction = { id: 1 };

    repo.findOneByUser.mockResolvedValue(transaction);

    const result = await service.findOneByUser(1, 1);

    expect(repo.findOneByUser).toHaveBeenCalledWith(1, 1);
    expect(result).toEqual(transaction);
  });
});
