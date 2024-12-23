import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { AdminModule } from "../admin/admin.module";
import { UserModule } from "../user/user.module";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [
    AdminModule,
    UserModule,
    EmailModule,
    JwtModule.register({
      global: true, // JWTni global qilib sozlash
    }),
  ],
  exports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService], // Faqat AuthService qoldiriladi
})
export class AuthModule {}
