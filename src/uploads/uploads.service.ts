import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';

@Injectable()
export class UploadsService {

  uploadSingleFile(file: Express.Multer.File) {
    console.log('file content :', file);

  }
}
