import { Global, Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadSchema, Uploads } from 'src/uploads/schema/upload.schema';
import { ProcessSchema, Process } from 'src/azure-ai-video-indexer/schema/process.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Uploads.name,
        schema: UploadSchema,
      },
      {
        name: Process.name,
        schema: ProcessSchema,
      },
    ]),
  ],
  providers: [ModelService],
  exports: [ModelService],
})
export class ModelModule { }
