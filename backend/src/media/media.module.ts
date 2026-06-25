import { Module } from '@nestjs/common';
import { CloudinaryConfig } from './cloudinary.config';
import { MediaService } from './media.service';

@Module({
    providers: [CloudinaryConfig, MediaService],
    exports: [MediaService, CloudinaryConfig],
})
export class MediaModule { }

