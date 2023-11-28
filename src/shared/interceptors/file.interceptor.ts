import { BadRequestException, Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class FileUploadInterceptor {
    constructor(private readonly fileName: string, private readonly mimeTypes: string[]) { }

    public getInterceptor() {
        return FileInterceptor(this.fileName, {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const fileExt = extname(file.originalname)
                    const fileName = `${file.originalname.trim().split('.')[0].toLowerCase().replace(/ /g, "-")}_${Date.now()}${fileExt}`;
                    cb(null, fileName);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (this.mimeTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new BadRequestException('File format not supported'), false);
                }
            }
        });
    }
}