import { Global, Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadSchema, Uploads } from 'src/uploads/schema/upload.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Uploads.name,
        schema: UploadSchema,
      },
    ]),
  ],
  providers: [ModelService],
  exports: [ModelService],
})
export class ModelModule {}
