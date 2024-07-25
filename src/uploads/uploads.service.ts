import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelService } from 'src/model/model.service';
import mongoose, { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as moment from 'moment';


@Injectable()
export class UploadsService {
  private bucketName: string;
  private s3: AWS.S3

  constructor(
    private readonly Model: ModelService,
    private readonly ConfigService: ConfigService
  ) {
    this.bucketName = this.ConfigService.get<string>('AWS_BUCKET_NAME');
    AWS.config.update({
      accessKeyId: this.ConfigService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.ConfigService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.ConfigService.get<string>('AWS_REGION')
    });
    this.s3 = new AWS.S3();
  }

  //Basic S3 Upload
  async uploadSingleFile(file: Express.Multer.File,) {
    try {
      let fileKey;
      fileKey = await this.generate_file_name(file.originalname);
      let fileBuffer: any = file.buffer;
      const params: AWS.S3.Types.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: `uploads/${fileKey}`,
        Body: fileBuffer,
        ContentType: file.mimetype,
        ACL: "public-read"     // Make it public accessible for Azure ai video indexer
      };
      const uploadResult = await this.s3.upload(params).promise();

      let data_to_save = {
        video_title: fileKey,
        video_url: uploadResult.Location
      }
      let saved = await this.Model.Process.create(data_to_save);
      return { video_details: saved };
    } catch (error) {
      console.error('Somthing went wrong while uploading file :', error)
      throw new HttpException('Somthing went wrong while uploading file!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  generate_file_name = async (file_name: string) => {
    try {
      let current_millis = moment().format('x')
      let raw_file_name = file_name.split(/\s/).join('');
      let split_file = raw_file_name.split('.')
      // // spiting by all special charcters
      let split_all = split_file[0].split(/[^a-zA-Z0-9]/g).join('_')
      let name = split_all.toLowerCase()
      let ext = file_name.split('.').pop();
      let gen_file_name = `${name}_${current_millis}.${ext}`
      return gen_file_name.toLowerCase()
    }
    catch (err) {
      throw err;
    }
  }
}
