// import { PartialType } from '@nestjs/swagger';
// import { CreateAdminDto } from './create-admin.dto';

// export class UpdateAdminDto extends PartialType(CreateAdminDto) {}

import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { CreateAdminDto } from "./create-admin.dto";

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiProperty({
    example: "Admin",
    description: "Admin name",
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    example: "+998-99-123-45-67",
    description: "Admin phone number",
    required: false,
  })
  @IsPhoneNumber("UZ")
  phone_number?: string;

  @ApiProperty({
    example: true,
    description: "Is admin creator?",
    required: false,
  })
  @IsBoolean()
  is_creator?: boolean;

  @ApiProperty({
    example: true,
    description: "Is admin active?",
    required: false,
  })
  
  @IsBoolean()
  is_active?: boolean;
}
