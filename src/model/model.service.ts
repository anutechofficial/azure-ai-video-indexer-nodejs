import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Uploads } from 'src/uploads/schema/upload.schema';

@Injectable()
export class ModelService {
  constructor(
    @InjectModel(Uploads.name) public UploadModel: mongoose.Model<Uploads>,
  ) {}
}
