import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    create: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const dto = {
      email: 'test@mail.com',
      password: '123456',
      name: 'Test User',
      role: 'USER',
    };

    const resultMock = {
      id: 1,
      email: 'test@mail.com',
      name: 'Test User',
      role: 'USER',
    };

    authServiceMock.create.mockResolvedValue(resultMock);

    const result = await controller.create(dto as CreateAuthDto);

    expect(result).toEqual(resultMock);
    expect(authServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should login user and return access token', async () => {
    const dto = {
      email: 'test@mail.com',
      password: '123456',
    };

    const token = { access_token: 'jwt-token' };

    authServiceMock.login.mockResolvedValue(token);

    const result = await controller.login(dto);

    expect(result).toEqual(token);
    expect(authServiceMock.login).toHaveBeenCalledWith(dto.email, dto.password);
  });
});
