import { ApiProperty, PartialType } from '@nestjs/swagger';

export class DeactivateAdminDto{
    @ApiProperty({
        example: 1,
        description: 'Admin ID to deactivate'
    })
    readonly user_id: number
}
