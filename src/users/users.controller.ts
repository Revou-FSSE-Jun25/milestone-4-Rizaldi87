import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users Endpoints')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get profile of the logged-in user' })
  @ApiAcceptedResponse({ description: 'The user profile has been retrieved.' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Update profile of the logged-in user' })
  @ApiAcceptedResponse({ description: 'The user profile has been updated.' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiAcceptedResponse({ description: 'The users have been retrieved.' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get user by ID (Admin and User roles)' })
  @ApiAcceptedResponse({ description: 'The user has been retrieved.' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
