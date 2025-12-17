import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly repo: AccountRepository) {}
  create(userId: number, dto: CreateAccountDto) {
    return this.repo.createUserAccount(userId, dto);
  }

  findAllByUser(userId: number) {
    return this.repo.findUserAccounts(userId);
  }

  findOneByUser(userId: number, id: number) {
    return this.repo.findUserAccount(userId, id);
  }

  updateByUser(userId: number, id: number, dto: UpdateAccountDto) {
    return this.repo.updateUserAccount(userId, id, dto);
  }

  removeByUser(userId: number, id: number) {
    return this.repo.removeUserAccount(userId, id);
  }
}
