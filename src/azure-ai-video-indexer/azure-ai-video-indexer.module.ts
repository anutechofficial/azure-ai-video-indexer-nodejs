import { Module } from '@nestjs/common';
import { AzureAiVideoIndexerService } from './azure-ai-video-indexer.service';
import { AzureAiVideoIndexerController } from './azure-ai-video-indexer.controller';

@Module({
  controllers: [AzureAiVideoIndexerController],
  providers: [AzureAiVideoIndexerService],
})
export class AzureAiVideoIndexerModule {}
