import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Admin } from '../admin/entities/admin.dto';
import { User } from '../user/entities/user.entity';


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMailToAdmin(admin: Admin){
    const url = `${process.env.API_URL}:${process.env.PORT}/admin/activate/${admin.activation_link}`;
    await this.mailerService.sendMail({
      to: admin.email,
      subject: "Activate your account",
      template: "/home/asus/project/iqro_wep/src/email/templates/confirm.hbs",
      context: {
        name: admin.f_name + " " + admin.l_name,
        url,
      },
    });
  }

  async sendMailToCustomer(user: User) {
    const url = `${process.env.API_URL}:${process.env.PORT}/user/activate/${user.activation_link}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Activate your account",
      template: "/home/asus/project/iqro_wep/src/email/templates/confirm.hbs",
      context: {
        name: user.f_name + " " + user.l_name,
        url,
      },
    });
  }

}
