import { Injectable } from '@nestjs/common';
import { FinMaster } from 'finmaster';

@Injectable()
export class AppService {
  getHello(): any {
    return 'Hello World!'
  }
}
