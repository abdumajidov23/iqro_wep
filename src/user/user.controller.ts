import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({summary: 'User yaratish'})
  @ApiResponse({status: 201, description: "create user", type: User})
  @Post('create-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: "Barcha Userlarni ko'rish" })
  @ApiResponse({
    status: 200,
    description: "List of Users",
    type: [User],
  })
  // @UseGuards(AdminGuard)
  // @UseGuards(JwtAuthGuard)
  @Get('get-user')
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: "ID bo'yicha Userlarni ko'rish" })
  @ApiResponse({
    status: 200,
    description: "Get User by ID",
    type: User,
  })
  // @UseGuards(SelfGuard)
  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }


  @ApiOperation({ summary: "ID bo'yicha Useerlarni yangilash" })
  @ApiResponse({
    status: 200,
    description: "Update Users by ID",
    type: User,
  })
  // @UseGuards(SelfGuard)
  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(+id, updateUserDto);
  }


  @ApiOperation({ summary: "ID bo'yicha Userlarni o'chirish" })
  @ApiResponse({
    status: 200,
    description: "Delete User by ID",
    type: User,
  })
  // @UseGuards(SelfGuard)
  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get("activate/:link")
  async activateUser(@Param("link") link: string) {
    return this.userService.activateUser(link);
  }
}
