import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Column } from "typeorm";


export class CreateUserDto {
    @ApiProperty({
        example: 'user',
        description: 'user first name'
    })
    f_name: string;

    @ApiProperty({
        example: 'user',
        description: 'user last name'
    })
    l_name: string;

    @ApiProperty({
        example: 'user@gmail.com',
        description: 'user email'
    })
    email: any;

    @ApiProperty({
        example: "qwerty",
        description: "Password",
      })
      @IsString()
      @IsNotEmpty()
      password: string;

      @ApiProperty({
        example: "qwerty",
        description: "Confirm password",
      })
      @IsString()
      @IsNotEmpty()
      confirm_password: string;

      @ApiProperty({
        example: "qwerty",
        description: "Hashed Password",
      })
      @IsOptional()
      hashed_password?: string;
    
      @ApiProperty({
        example: "Hashed Refresh Token",
        description: "Hashed Refresh Token",
      })
      @IsOptional()
      hashed_refresh_token?: string;
    
      @ApiProperty({
        example: "link",
        description: "Activation Link",
      })
      @IsOptional()
      activation_link?: string;
}
