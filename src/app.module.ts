import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UploadsModule } from './uploads/uploads.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelModule } from './model/model.module';
import { AzureAiVideoIndexerModule } from './azure-ai-video-indexer/azure-ai-video-indexer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UploadsModule,
    MongooseModule.forRoot(process.env.DB_URI),
    ModelModule,
    AzureAiVideoIndexerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
