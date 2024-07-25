import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import mongoose, { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ModelService } from 'src/model/model.service';

@Injectable()
export class AzureAiVideoIndexerService {
  private azureApiUrl: string;
  private azureLocation: string;
  private azureAccountId: string;
  private azureApiKey: string;

  constructor(
    private readonly ConfigService: ConfigService,
    private readonly Model: ModelService
  ) {

    this.azureApiUrl = 'https://api.videoindexer.ai';
    this.azureLocation = this.ConfigService.get<string>('AZURE_LOCATION');
    this.azureAccountId = this.ConfigService.get<string>('AZURE_ACCOUNT_ID');
    this.azureApiKey = this.ConfigService.get<string>('AZURE_API_KEY');

  }

  async get_access_token() {
    let uuid = await uuidv4();
    console.log('uuid :', uuid);

    const response = await axios.get(`${this.azureApiUrl}/auth/${this.azureLocation}/Accounts/${this.azureAccountId}/AccessToken`, {
      headers: {
        'x-ms-client-request-id': uuid,
        'Ocp-Apim-Subscription-Key': `${this.azureApiKey}`,
      },
      params: {
        allowEdit: true,
      },
    });

    return { token: response.data, uuid: uuid };
  }

  async start_azure_ai_indexer(video_url: string, process_id: string) {
    try {

      //Get access token
      let accessToken = await this.get_access_token();
      let videoUrl = video_url
      let name = `video_${+Date.now()}`;

      //Upload Video
      const response = await axios.post(`${this.azureApiUrl}/${this.azureLocation}/Accounts/${this.azureAccountId}/Videos?name=${name}&accessToken=${accessToken.token}&privacy=Private&videoUrl=${encodeURIComponent(videoUrl)}`,
        {
          headers: {
            'x-ms-client-request-id': accessToken.uuid,
          },
        },
      );

      let query = { _id: new Types.ObjectId(process_id) }

      let data_to_save = {
        accout_id: response.data.accountId,
        video_id: response.data.id,
        state: response.data.state,
        processingProgress: response.data.processingProgress,
      }

      await this.Model.Process.findByIdAndUpdate(query, data_to_save, { new: true })

      console.log('start azure ai video indexer :', response.data);
      return { video_id: response.data.id, access_token: accessToken.token };
    } catch (error) {
      console.error(error)
      throw error
    }
  }


  async get_video_index_responce(access_token: string, video_id: string) {
    const url = `${this.azureApiUrl}/${this.azureLocation}/Accounts/${this.azureAccountId}/Videos/${video_id}/Index?accessToken=${access_token}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching video index:', error);
      throw error;
    }
  }


  async getVideoIndex(accessToken: string, videoId: string, process_id: string) {

    let videoStatus: any;
    let videoInsights: any;

    try {
      do {
        try {
          videoStatus = await this.get_video_index_responce(accessToken, videoId);

          console.log(`Current video status: ${videoStatus.state} : ${videoStatus.videos[0].processingProgress}, Video ID :`, videoId);

          let query = { _id: new Types.ObjectId(process_id) }
          let data_to_save = {
            processingProgress: videoStatus.videos[0].processingProgress,
            state: videoStatus.state
          }
          await this.Model.Process.findByIdAndUpdate(query, data_to_save, { new: true })

          if (videoStatus.state !== 'Processed') {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
          } else {
            videoInsights = videoStatus;
          }
        } catch (error) {
          console.error('Error fetching video status or insights:', error);
          throw error;
        }
      } while (videoStatus.state !== 'Processed');

      return videoInsights;
    } catch (error) {
      throw error
    }
  }


  async azure_ai_video_indexer(video_url: string, process_id: string) {
    try {
      let responce_data = await this.start_azure_ai_indexer(video_url, process_id);
      let index_responce = await this.getVideoIndex(responce_data.access_token, responce_data.video_id, process_id)
      return index_responce;
    } catch (error) {
      console.error('Error fetching video status or insights!', error)
      let query = { _id: new Types.ObjectId(process_id) }
      let data_to_save = {
        error_string: 'Failed to process video'
        // error_string: 'Error fetching video status or insights!'
      }
      await this.Model.Process.findByIdAndUpdate(query, data_to_save, { new: true })
    }
  }
}
