import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user);
  }

  async findAll() {
    return this.userRepo.find({
      where: { is_active: true },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email } });
  }
  

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    Object.assign(user, updateUserDto);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepo.delete(id);
    return { message: `User with ID ${id} removed` };
  }

  async activateUser(
    link: string,
  ): Promise<{ is_active: boolean; message: string }> {
    const user = await this.userRepo.findOne({
      where: { activation_link: link },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    if (user.is_active) {
      throw new BadRequestException('Customer already activated');
    }
    user.is_active = true;
    await this.userRepo.save(user);

    return {
      is_active: user.is_active,
      message: 'Customer activated successfully',
    };
  }
}
