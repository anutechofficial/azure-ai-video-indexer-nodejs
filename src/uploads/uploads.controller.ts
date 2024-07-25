import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Body,
} from '@nestjs/common';
import {
  FileInterceptor,
} from '@nestjs/platform-express'; // Import Request from express
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as mimeTypes from 'mime-types';
import { UploadsService } from './uploads.service';
import { UpdateUploadDto } from './dto/update-upload.dto';

const allowedMimeTypes = [
  'video/mp4',           // MP4 format
  'video/x-msvideo',     // AVI format
  'video/quicktime',     // MOV format
];

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }

  @ApiOperation({ summary: 'Upload single file with file key' })
  @Post('singlefile')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('There is no file!', HttpStatus.BAD_REQUEST);
    }
    const mimeType: any = mimeTypes.lookup(file.originalname);
    if (!allowedMimeTypes.includes(mimeType)) {
      const allowedTypesString = allowedMimeTypes
        .map((type) => type.split('/')[1])
        .join(', ');
      throw new HttpException(
        `Unsupported file type ${mimeTypes.extension(mimeType)}, Please upload files of type: ${allowedTypesString}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.uploadsService.uploadSingleFile(file);
  }

}
