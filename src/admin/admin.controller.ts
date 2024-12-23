import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Admin } from './entities/admin.dto';


@ApiTags("Admins")
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @ApiOperation({summary: 'Admin yaratish'})
  @ApiResponse({status: 200, description: "create admin", type: Admin})
  @Post('create-admin')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }


  @ApiOperation({summary:"Barcha Adminlarni ko'rish"})
  @ApiResponse({status: 200, description: "adminlarni ko'rish", type: [Admin]})
  @Get('get-admin')
  findAll() {
    return this.adminService.findAll();
  }

  @ApiOperation({ summary: "Adminni ID bo'yicha ko'rish" })
  @ApiResponse({ status: 200, description: "Admin topildi", type: Admin })
  @ApiResponse({ status: 404, description: "Admin topilmadi" })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  @ApiOperation({ summary: "Adminni ID bo'yicha o'zgartirish" })
  @ApiResponse({ status: 200, description: "Admin o'zgartirildi", type: Admin })
  @ApiResponse({ status: 404, description: "Admin topilmadi" })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }


  @ApiOperation({ summary: "Adminni ID bo'yicha o'chirish" })
  @ApiResponse({ status: 200, description: "Admin o'chirildi", type: Admin })
  @ApiResponse({ status: 404, description: "Admin topilmadi" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

}
