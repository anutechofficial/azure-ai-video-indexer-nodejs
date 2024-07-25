import { PartialType } from '@nestjs/swagger';
import { CreateAzureAiVideoIndexerDto } from './create-azure-ai-video-indexer.dto';

export class UpdateAzureAiVideoIndexerDto extends PartialType(CreateAzureAiVideoIndexerDto) {}
