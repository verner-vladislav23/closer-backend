import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import MinioConfig from 'src/config/minio';
import { BufferedFile } from 'src/models/File';
import * as crypto from 'crypto';

const sharp = require('sharp');

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket = MinioConfig.bucket;
  private readonly maxFileSize = 5000000;

  public get client() {
    return this.minio.client;
  }

  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioStorageService');
  }

  public async upload(file: BufferedFile, baseBucket: string = this.baseBucket) {
    if (file.size > this.maxFileSize) {
      throw new HttpException('Image is too large', HttpStatus.BAD_REQUEST)
    }
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
    }

    let timestamp = Date.now().toString()
    let hashedFileName = crypto.createHash('md5').update(file.buffer).digest("hex");
    let ext = '.png';
    const metaData = {
      'Content-Type': file.mimetype,
    };

    let fileName = `avatars/${hashedFileName}_${timestamp}${ext}`

    const sharpedFileBuffer = await sharp(file.buffer).png().toBuffer();

    this.client.putObject(baseBucket, fileName, sharpedFileBuffer,
      metaData, function (err, res) {
        if (err) throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
      })

    return {
      //url: `${MinioConfig.endPoint}:${MinioConfig.port}/${MinioConfig.bucket}/${filename}`
      url: fileName
    }
  }

  async delete(objectName: string, baseBucket: string = this.baseBucket) {
    this.client.removeObject(baseBucket, objectName, function (err, res) {
      if (err) throw new HttpException("Oops Something wrong happend", HttpStatus.BAD_REQUEST)
    })
  }
}

