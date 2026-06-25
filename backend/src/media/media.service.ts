import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CloudinaryConfig } from './cloudinary.config';
import { v4 as uuidv4 } from 'uuid';

type UploadFolder = 'events' | 'clubs' | 'avatars' | 'certificates';

interface UploadSignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  publicId: string;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(private readonly cloudinaryConfig: CloudinaryConfig) {}

  /**
   * Generate a signed upload signature for direct browser → Cloudinary uploads.
   * The frontend uses this to upload files directly without going through the BE.
   */
  generateUploadSignature(folder: UploadFolder): UploadSignature {
    const cloudinary = this.cloudinaryConfig.getInstance();
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `${folder}/${uuidv4()}`;

    const paramsToSign = {
      folder,
      public_id: publicId,
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET || '',
    );

    const config = cloudinary.config();

    this.logger.log(`Generated upload signature for folder: ${folder}`);

    return {
      signature,
      timestamp,
      cloudName: config.cloud_name as string,
      apiKey: config.api_key as string,
      folder,
      publicId,
    };
  }

  /**
   * Delete an asset from Cloudinary by its public_id.
   */
  async deleteAsset(publicId: string): Promise<void> {
    if (!publicId) return;

    try {
      const cloudinary = this.cloudinaryConfig.getInstance();
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Deleted cloudinary asset: ${publicId}`);
    } catch (error) {
      this.logger.error(`Failed to delete cloudinary asset: ${publicId}`, error);
      throw new BadRequestException('Failed to delete media asset');
    }
  }
}
