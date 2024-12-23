import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @ApiProperty({
    example: 1,
    description: "User unique ID (autoIncrement)",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "Admin",
    description: "User first name",
  })
  @Column({ length: 100 })
  f_name: string;

  @ApiProperty({
    example: "Admin",
    description: "User last name",
  })
  @Column({ length: 100 })
  l_name: string;

  @ApiProperty({
    example: "admin@gmail.com",
    description: "User email",
  })
  @Column({ unique: true, length: 150 })
  email: string;

  @ApiProperty({
    example: "qwerty12345$",
    description: "User password",
  })
  @Column({ nullable: true })
  hashed_password?: string;

  @ApiProperty({
    example: "Admin refresh token",
    description: "User refresh token",
  })
  @Column({ nullable: true })
  hashed_refresh_token?: string;

  @ApiProperty({
    example: true,
    description: "User status (active)",
  })
  @Column({ default: false })
  is_active: boolean;

  @ApiProperty({
    example: "https://example.com/user/activate/123456",
    description: "User activation link",
  })
  @Column({ nullable: true })
  activation_link: string;
}
