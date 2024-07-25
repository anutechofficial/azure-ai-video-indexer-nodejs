import { ApiProperty } from "@nestjs/swagger";

export class CreateAzureAiVideoIndexerDto {

    @ApiProperty({ description: "Enter here video url", required: true })
    video_url: string;
}
