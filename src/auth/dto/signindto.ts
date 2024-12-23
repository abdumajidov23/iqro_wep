import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";


export class SingInDto{
    @ApiProperty({
        example: 'alijonabdumajidov@gmail.com',
        description: 'Admin gmail'
    })
    @Column()
    email: string;

    @ApiProperty({
        example: 'qwerty123456',
        description: 'Admin parol'
    })
    @Column()
    password: string;
}