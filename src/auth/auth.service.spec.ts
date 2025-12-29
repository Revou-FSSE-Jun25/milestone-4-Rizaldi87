//untuk mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockjwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockjwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto = {
      email: 'B7vFv@example.com',
      name: 'John Doe',
      password: 'strongPassword123',
      role: 'USER',
    };
    const createdUser = {
      id: 1,
      email: 'B7vFv@example.com',
      name: 'John Doe',
      role: 'USER',
    };

    mockUsersRepository.create.mockResolvedValue(createdUser);

    const result = await service.create(createUserDto);
    expect(result).toEqual(createdUser);
    expect(mockUsersRepository.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);

    await expect(
      service.login('B7vFv@example.com', 'strongPassword123'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    const user = {
      id: 1,
      email: 'B7vFv@example.com',
      password: '$2b$10$hashedPassword',
      role: 'USER',
    };

    mockUsersRepository.findByEmail.mockResolvedValue(user);

    await expect(
      service.login('B7vFv@example.com', 'wrongPassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should login a user and return access token', async () => {
    const email = 'B7vFv@example.com';
    const password = 'strongPassword123';
    const user = {
      id: 1,
      email,
      password: '$2b$10$hashedPassword',
      role: 'USER',
    };
    const accessToken = 'access_token';

    mockUsersRepository.findByEmail.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    mockjwtService.sign.mockReturnValue(accessToken);

    const result = await service.login(email, password);
    expect(result).toEqual({ access_token: accessToken });
    // expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(mockjwtService.sign).toHaveBeenCalledWith(
      { sub: user.id, email, role: user.role },
      { expiresIn: '1d' },
    );
  });
});
