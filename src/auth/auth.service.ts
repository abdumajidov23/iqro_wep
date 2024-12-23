import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { Response } from 'express';
import { Admin } from '../admin/entities/admin.dto';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { SingInDto } from './dto/signindto';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { MailService } from '../email/email.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly mailService: MailService ,
    private readonly jwtService: JwtService
  ) {}

  async setRefreshTokenCookie(res : Response , refreshToken : string){
    res.cookie('refresh_token', refreshToken , {
    httpOnly: true,
    maxAge: Number(process.env.REFRESH_TIME_MS)
    });
  }

  async generateTokenWithAdmin(admin : Admin){
    const payload = {
      id: admin.id,
      email : admin.email,
      is_creator: admin.is_creator,
      is_active: admin.is_active,
      is_admin: true
    }

    const [access_token , refresh_token ] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME
      })
    ])

    return {access_token , refresh_token}

  }

    async addAdmin(createAdminDto: CreateAdminDto , res: Response){
        const existingAdmin = await this.adminService.findAdminByEmail(
          createAdminDto.email
        );
      
        if(existingAdmin){
          throw new BadRequestException("Bunday admin mavjud")
        }

        if(createAdminDto.password !== createAdminDto.confirm_password){
          throw new BadRequestException("Parollar mos emas!")
        }

        const hashed_password = await bcrypt.hash(createAdminDto.password,10);
        const newAdmin = await this.adminService.create({
          ...createAdminDto,
          hashed_password
          
        })


        const tokens = await this.generateTokenWithAdmin(newAdmin);
        const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 10);
        const activation_link = uuid.v4();
        const updatedAdmin = await this.adminService.update(newAdmin.id, {
          hashed_refresh_token,
          activation_link,
        });

        res.cookie("refresh_token", tokens.refresh_token, {
          httpOnly: true,
          maxAge: +process.env.REFRESH_TIME_MS,
        });
    
        return {
          message: "Admin muvaffaqiyatli qo'shildi!",
          admin: updatedAdmin,
          access_token: tokens.access_token,
        };
    }

    async signInAdmin(signInAdminDto: SingInDto, res: Response) {
      const admin = await this.adminService.findAdminByEmail(
        signInAdminDto.email
      );
    
      if (!admin) {
        throw new BadRequestException("Login yoki parol noto'g'ri");
      }
    
      const isPasswordValid = await bcrypt.compare(
        signInAdminDto.password,
        admin.hashed_password
      );
    
      if (!isPasswordValid) {
        throw new BadRequestException("Login yoki parol noto'g'ri");
      }
    
      if (!admin.is_active) {
        throw new BadRequestException("Admin hali faollashtirilmagan");
      }
    
      const tokens = await this.generateTokenWithAdmin(admin);
      const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 10);
    
      await this.adminService.update(admin.id, { hashed_refresh_token });
    
      res.cookie("refresh_token", tokens.refresh_token, {
        httpOnly: true,
        maxAge: +process.env.REFRESH_TIME_MS,
      });
    
      return {
        message: "Tizimga muvaffaqiyatli kirdingiz",
        admin,
        access_token: tokens.access_token,
      };
    }
    

    async signOutAdmin(refreshToken: string , res: Response) {
      const payload = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      })

      const admin = await this.adminService.findOne(payload.id)
      if(!admin){
        throw new BadRequestException("admin topilmadi")
      }

      await this.adminService.update(admin.id, {hashed_refresh_token: null})

      res.clearCookie("refresh_token")
    
      return  {
        message: `admin muvaffaqiyatli chiqib ketti ${admin.f_name}`
      }
    }


    async refreshTokensAdmin(refresh_token: string, res: Response) {
      try {
        const payload = await this.jwtService.verifyAsync(refresh_token, {
          secret: process.env.REFRESH_TOKEN_KEY,
        });
  
        const admin = await this.adminService.findOne(payload.id);
        if (!admin) {
          throw new UnauthorizedException("Admin not found");
        }
  
        const valid_refresh_token = await bcrypt.compare(
          refresh_token,
          admin.hashed_refresh_token
        );
        if (!valid_refresh_token) {
          throw new UnauthorizedException("Unauthorized admin");
        }
  
        const tokens = await this.generateTokenWithAdmin(admin);
        const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 3);
  
        await this.adminService.update(admin.id, { hashed_refresh_token });
  
        res.cookie("refresh_token", tokens.refresh_token, {
          httpOnly: true,
          maxAge: +process.env.REFRESH_TIME_MS,
        });
  
        return {
          access_token: tokens.access_token,
        };
      } catch (error) {
        throw new BadRequestException("Expired token");
      }
    }

    async generateTokensWithUser(user: User){
      const payload = {
        id: user.id,
        email: user.email,
        is_active: user.activation_link
      }

      const [access_token , refresh_token] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: process.env.ACCESS_TOKEN_KEY,
          expiresIn: process.env.ACCESS_TOKEN_TIME,
        }),
        this.jwtService.signAsync(payload, {
          secret: process.env.REFRESH_TOKEN_KEY,
          expiresIn: process.env.REFRESH_TOKEN_TIME
        })
      ])
      
      return {access_token , refresh_token};
    }
    async signUpUser(createUserDto: CreateUserDto, res: Response) {
      // Foydalanuvchini email orqali qidirish
      const existingUser = await this.userService.findUserByEmail(createUserDto.email);
    
      if (existingUser) {
        throw new BadRequestException("Bunday user mavjud");
      }
    
      // Parollarni solishtirish
      if (createUserDto.password !== createUserDto.confirm_password) {
        throw new BadRequestException("Parollar mos emas");
      }
    
      // Parolni xesh qilish
      const hashed_password = await bcrypt.hash(createUserDto.password, 10);
    
      // Yangi foydalanuvchini yaratish
      const newUser = await this.userService.create({
        ...createUserDto,
        hashed_password,
      });
    
      // Tokenlarni yaratish
      const tokens = await this.generateTokensWithUser(newUser);
    
      // Refresh tokenni xavfsiz tarzda xesh qilish
      const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 10);
    
      // Aktivatsiya havolasini yaratish
      const activation_link = uuid.v4();
    
      // Foydalanuvchi ma'lumotlarini yangilash
      const updatedUser = await this.userService.update(newUser.id, {
        hashed_refresh_token,
        activation_link,
      });
    
      // Refresh tokenni cookie'ga saqlash
      res.cookie("refresh_token", tokens.refresh_token, {
        httpOnly: true,
        maxAge: +process.env.REFRESH_TIME_MS, // Cookie umri
      });
    
      // Elektron pochta yuborish
      try {
        await this.mailService.sendMailToCustomer(updatedUser);
      } catch (error) {
        throw new InternalServerErrorException("Error sending mail to user");
      }
    
      // Foydalanuvchi muvaffaqiyatli qo'shildi
      return {
        message: "User muvaffaqiyatli qo'shildi",
        user: updatedUser,
        tokens,
      };
    }
    
    

    async signInUSer(sigInUserDto: SingInDto, res: Response){
      const user = await this.userService.findUserByEmail(
        sigInUserDto.email
      );

      if(!user){
        throw new BadRequestException("Login yoki parol xato")
      }

      const isPasswordValid = await bcrypt.compare(
        sigInUserDto.password,
        user.hashed_password
      )

      if(!isPasswordValid){
        throw new BadRequestException("Login yoki parol xato")
      }

      if(!user.is_active){
        throw new BadRequestException("user hali faollashmagan")
      }

      const tokens = await this.generateTokensWithUser(user)
      const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 4)

      await this.userService.update(user.id, {hashed_refresh_token})

      await this.setRefreshTokenCookie(res, tokens.refresh_token)

      return {
        message: "tizimga muvaffaqiyatli kirildi",
        user,
        tokens
        
      }
    }

    async signOutUser(refreshToken: string , res: Response){
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      const user = await this.userService.findOne(payload.id);
      if(!user){
        throw new BadRequestException('admin not foud')
      }

      await this.userService.update(user.id, {
        hashed_refresh_token: null
      })

      res.clearCookie("refresh_token")

      return {
        message: {
          message: "user muvaffaqiyatli  chiqdi"
        }
      }
    }

    async refreshTokensUser(refresh_token: string, res: Response) {
      try {
        const payload = await this.jwtService.verifyAsync(refresh_token, {
          secret: process.env.REFRESH_TOKEN_KEY,
        });
  
        const user = await this.userService.findOne(payload.id);
        if (!user) {
          throw new UnauthorizedException("Customer not found");
        }
  
        const valid_refresh_token = await bcrypt.compare(
          refresh_token,
          user.hashed_refresh_token
        )

        if (!valid_refresh_token) {
          throw new UnauthorizedException("Unauthorized admin");
        }
  
        const tokens = await this.generateTokensWithUser(user);
        const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 3);
  
        await this.userService.update(user.id, { hashed_refresh_token });
  
        res.cookie("refresh_token", tokens.refresh_token, {
          httpOnly: true,
          maxAge: +process.env.REFRESH_TIME_MS,
        });
  
        return {
          access_token: tokens.access_token,
        };
      } catch (error) {
        throw new BadRequestException("Expired token");
      }
    }
}