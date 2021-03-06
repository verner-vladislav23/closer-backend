import { Injectable } from '@nestjs/common';
import { MinioClientService } from '../minio-client.service';
import { BufferedFile } from 'src/models/File';

@Injectable()
export class FileUploadService {
    constructor(
        private minioClientService: MinioClientService
    ) { }

    /**
     * Upload image
     * @param image 
     */
    async uploadImage(image: BufferedFile) {
        const uploadedImage = await this.minioClientService.upload(image)
        return uploadedImage.url;
    }

    async deleteImage(image_url: string) {
        try {
            await this.minioClientService.delete(image_url);
        } catch (exception) {
            ///
        }
    }




}
