import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { Response } from 'express';
import { access } from 'fs';
import { SingInDto } from './dto/signindto';
import { Admin } from 'typeorm';
import { CookieGetter } from '../decorators/cookie_getter.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({summary: "Yangi admin qo'shish"})
  @ApiResponse({
    status: 201, 
    description: "Admin muvaffaqiyatli qo'shildi",
    schema: {
      example:{
        message:"admin muvaffaqiyatli qo'shildi",
        admin:{
          id:1,
          email:"admin@example.com",
          is_active:true,
          is_creator:true,
        },
        access_token:"access_token",
      }
    }
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('add-admin')
  create(
    @Body() createAdminDto: CreateAdminDto,
    @Res({passthrough: true}) res : Response
  ) {
    return this.authService.addAdmin(createAdminDto , res);
  }
  @ApiOperation({ summary: "Adminni tizimga kiritish (signIn)" })
  @ApiResponse({
    status: 200,
    description: "Tizimga kirish muvaffaqiyatli",
    schema: {
      example: {
        message: "Tizimga muvaffaqiyatli kirildi",
        admin: {
          id: 1,
          email: "admin@gmail.com",
          is_active: true,
        },
        access_token: "access_token",
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post("sign-in")
  async signIn(
    @Body() signInDto: SingInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signInAdmin(signInDto, res);
  }

  @ApiOperation({ summary: "Adminni tizimdan chiqarish (signOut)" })
  @ApiResponse({
    status: 200,
    description: "Admin tizimdan muvaffaqiyatli chiqarildi",
    schema: {
      example: {
        message: "Tizimdan muvaffaqiyatli chiqildi",
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post("sign-out")
  async signOut(
    @CookieGetter('refresh_token') refreshToken:string,
    @Res({passthrough: true}) res: Response
  ){
    return this.authService.signOutAdmin(refreshToken, res)
  }  


  @ApiOperation({ summary: "Yangi access token olish (refreshToken)" })
  @ApiResponse({
    status: 200,
    description: "Yangi access token berildi",
    schema: {
      example: {
        access_token: "yangi_access_token",
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post("refreshtoken-admin")
  async refreshTokenAdmin(
    @Res({ passthrough: true }) res: Response,
    @CookieGetter("refresh_token") refresh_token: string
  ) {
    return this.authService.refreshTokensAdmin(refresh_token, res);
  }

  @ApiResponse({
    status: 201,
    description: "user muvaffaqiyatli qo'shildi",
    schema: {
      example: {
        message: "user muvaffaqiyatli ro'yxatdan o'tdi!",
        admin: {
          id: 1,
          email: "user",
          is_active: true,
          is_creator: true,
        },
        access_token: "access_token",
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up-user')
  async signUpUser(
    @Body() createCustomerDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    // Foydalanuvchini ro'yxatdan o'tkazish va javob qaytarish
    return this.authService.signUpUser(createCustomerDto, res);
  }

  @ApiOperation({ summary: "Customerni tizimga kiritish (signIn)" })
  @ApiResponse({
    status: 200,
    description: "Tizimga kirish muvaffaqiyatli",
    schema: {
      example: {
        message: "Tizimga muvaffaqiyatli kirildi",
        admin: {
          id: 1,
          email: "user@gmail.com",
          is_active: true,
        },
        access_token: "access_token",
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post("sign-in-user")
  async signInUser(
    @Body() signInDto: SingInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signInUSer(signInDto, res);
  }

  @ApiOperation({ summary: "user tizimdan chiqarish (signOut)" })
  @ApiResponse({
    status: 200,
    description: "user tizimdan muvaffaqiyatli chiqarildi",
    schema: {
      example: {
        message: "Tizimdan muvaffaqiyatli chiqildi",
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post("sign-out-user")
  async signOutUser(
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signOutUser(refreshToken, res);
  }

  @ApiOperation({ summary: "Yangi access token olish (refreshToken)" })
  @ApiResponse({
    status: 200,
    description: "Yangi access token berildi",
    schema: {
      example: {
        access_token: "yangi_access_token",
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post("refreshtoken-user")
  async refreshTokenUser(
    @Res({ passthrough: true }) res: Response,
    @CookieGetter("refresh_token") refresh_token: string
  ) {
    return this.authService.refreshTokensUser(refresh_token, res);
  }

}
