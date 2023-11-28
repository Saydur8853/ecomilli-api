import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateNewsStatDto {
    @IsNotEmpty()
    @IsIn(['share', 'views'], {
        message: 'Stat can only be "share" or "views"',
    })
    stat: 'share' | 'views';
}
