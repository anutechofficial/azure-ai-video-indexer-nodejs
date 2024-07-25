import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AzureAiVideoIndexerService } from './azure-ai-video-indexer.service';
import { CreateAzureAiVideoIndexerDto } from './dto/create-azure-ai-video-indexer.dto';
import { UpdateAzureAiVideoIndexerDto } from './dto/update-azure-ai-video-indexer.dto';

@Controller('azure-ai-video-indexer')
export class AzureAiVideoIndexerController {
  constructor(private readonly azureAiVideoIndexerService: AzureAiVideoIndexerService) { }

  @Post(':_id')
  create(@Body() createAzureAiVideoIndexerDto: CreateAzureAiVideoIndexerDto, @Param('_id') _id: string) {
    return this.azureAiVideoIndexerService.azure_ai_video_indexer(createAzureAiVideoIndexerDto.video_url, _id);
  }
}
