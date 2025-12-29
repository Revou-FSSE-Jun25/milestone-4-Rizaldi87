import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  const transactionsServiceMock = {
    deposit: jest.fn(),
    withdraw: jest.fn(),
    tranfer: jest.fn(),
    findAllByUser: jest.fn(),
    findOneByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: transactionsServiceMock,
        },
      ],
    })
      // bypass JwtAuthGuard
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ================= DEPOSIT =================
  it('should deposit money into account', async () => {
    const req = { user: { userId: 1 } };
    const body = { accountId: 10, amount: 500 };
    const resultMock = { success: true };

    transactionsServiceMock.deposit.mockResolvedValue(resultMock);

    const result = await controller.deposit(req as any, body);

    expect(transactionsServiceMock.deposit).toHaveBeenCalledWith(1, 10, 500);
    expect(result).toEqual(resultMock);
  });

  // ================= WITHDRAW =================
  it('should withdraw money from account', async () => {
    const req = { user: { userId: 1 } };
    const body = { accountId: 10, amount: 200 };
    const resultMock = { success: true };

    transactionsServiceMock.withdraw.mockResolvedValue(resultMock);

    const result = await controller.withdraw(req as any, body);

    expect(transactionsServiceMock.withdraw).toHaveBeenCalledWith(1, 10, 200);
    expect(result).toEqual(resultMock);
  });

  // ================= TRANSFER =================
  it('should transfer money between accounts', async () => {
    const req = { user: { userId: 1 } };
    const body = {
      accountId: 10,
      amount: 300,
      targetAccountId: 20,
    };
    const resultMock = { success: true };

    transactionsServiceMock.tranfer.mockResolvedValue(resultMock);

    const result = await controller.transfer(req as any, body);

    expect(transactionsServiceMock.tranfer).toHaveBeenCalledWith(
      1,
      10,
      300,
      20,
    );
    expect(result).toEqual(resultMock);
  });

  // ================= FIND ALL =================
  it('should return all transactions for user', async () => {
    const req = { user: { userId: 1 } };
    const transactions = [{ id: 1 }, { id: 2 }];

    transactionsServiceMock.findAllByUser.mockResolvedValue(transactions);

    const result = await controller.findAll(req as any);

    expect(transactionsServiceMock.findAllByUser).toHaveBeenCalledWith(1);
    expect(result).toEqual(transactions);
  });

  // ================= FIND ONE =================
  it('should return transaction by id for user', async () => {
    const req = { user: { userId: 1 } };
    const transaction = { id: 1 };

    transactionsServiceMock.findOneByUser.mockResolvedValue(transaction);

    const result = await controller.findOne(req as any, '1');

    expect(transactionsServiceMock.findOneByUser).toHaveBeenCalledWith(1, 1);
    expect(result).toEqual(transaction);
  });
});
