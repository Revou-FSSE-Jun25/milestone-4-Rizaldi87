import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import {
  ApiAcceptedResponse,
  ApiAmbiguousResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Accounts Endpoints')
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({ summary: 'Create a new account based on user' })
  @ApiAcceptedResponse({ description: 'The account has been created.' })
  @ApiCreatedResponse({
    description: 'The account has been created.',
    type: CreateAccountDto,
  })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @Post()
  create(@Req() req, @Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(req.user.userId, createAccountDto);
  }

  @ApiOperation({ summary: 'Get all accounts based on user' })
  @ApiAcceptedResponse({ description: 'The accounts have been retrieved.' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @Get()
  findAll(@Req() req) {
    return this.accountsService.findAllByUser(req.user.userId);
  }

  @ApiOperation({ summary: 'Get account by ID based on user' })
  @ApiAcceptedResponse({ description: 'The account has been retrieved.' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.accountsService.findOneByUser(req.user.userId, +id);
  }

  @ApiOperation({ summary: 'Update account by ID based on user' })
  @ApiAcceptedResponse({ description: 'The account has been updated.' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.updateByUser(
      req.user.userId,
      +id,
      updateAccountDto,
    );
  }

  @ApiOperation({ summary: 'Delete account by ID based on user' })
  @ApiAcceptedResponse({ description: 'The account has been deleted.' })
  @ApiBadRequestResponse({ description: 'Unauthorized' })
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.accountsService.removeByUser(req.user.userId, +id);
  }
}
