import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';

@ApiTags('Auth Endpoints')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiAcceptedResponse({ description: 'The user has been registered.' })
  @ApiCreatedResponse({
    description: 'The user has been registered.',
    type: CreateAuthDto,
  })
  @ApiBadRequestResponse({
    description: 'User with this email already exists.',
  })
  @Post('/register')
  create(@Body() createUserDto: CreateAuthDto) {
    return this.authService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiAcceptedResponse({ description: 'The user has been logged in.' })
  @ApiCreatedResponse({
    description: 'The user has been logged in.',
    type: LoginDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid credentials.' })
  @Post('/login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
