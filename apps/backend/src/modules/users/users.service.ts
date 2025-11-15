import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByPhone(phone_e164: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phone_e164 } });
  }

  async create(data: { phone_e164: string; role?: User['role']; display_name?: string }): Promise<User> {
    const user = this.usersRepository.create({
      phone_e164: data.phone_e164,
      role: data.role || 'client',
      display_name: data.display_name,
    });
    return this.usersRepository.save(user);
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updates);
    return this.findById(id);
  }
}

