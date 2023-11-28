import { IsArray, IsOptional, ArrayMaxSize, ArrayMinSize, ValidateIf, Validate } from 'class-validator';

export class ImageUpload {
    featuredImage: string;
    galleryImages: {
        image: string;
    }[];
}



export class ImageUploadDto {
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one image is required.' })
    @ArrayMaxSize(10, { message: 'Maximum 10 images allowed.' })
    @ValidateIf((o) => o.featuredImage)
    @Validate((files: Express.Multer.File[]) => {
        const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jepg', 'image/webp'];
        const isValidMimeType = files.every((file) => allowedMimeTypes.includes(file.mimetype));
        if (!isValidMimeType) {
            throw new Error('Invalid MIME type for Featured Image.');
        }
        return true;
    })
    featuredImage?: Express.Multer.File[];

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one image is required.' })
    @ArrayMaxSize(10, { message: 'Maximum 10 images allowed.' })
    @ValidateIf((o) => o.galleryImages)
    @Validate((files: Express.Multer.File[]) => {
        const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jepg', 'image/webp'];
        const isValidMimeType = files.every((file) => allowedMimeTypes.includes(file.mimetype));
        if (!isValidMimeType) {
            throw new Error('Invalid MIME type for Gallery Images.');
        }
        return true;
    })
    galleryImages?: Express.Multer.File[];
}