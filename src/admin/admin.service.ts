import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.dto';
import { emit } from 'process'; 

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin> 
  ){}

  create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const admin = this.adminRepo.create(createAdminDto)
    return this.adminRepo.save(admin);
  }

  async findAll(): Promise<Admin[]>{
    return await this.adminRepo.find();
  }

  async findAdminByEmail(email: string): Promise<Admin> {
    const admin = await this.adminRepo.findOneBy({email})
    return admin
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepo.findOneBy({id});
    if(!admin){
      throw new NotFoundException(`Admin with ID ${id} not found`)
    }
    return admin;
  }
  

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepo.findOne({ where: { id } });
    Object.assign(admin, updateAdminDto);
    return this.adminRepo.save(admin);
  }

  async remove(id: number){
    const admin = await this.adminRepo.findOne({where: { id } });
    if(!admin){
      throw new NotFoundException(`Admin with ID - ${id} not found`)
    }
    await this.adminRepo.delete(admin);
    return { message : `Admin with ID - ${id} removed` };
  }

}
