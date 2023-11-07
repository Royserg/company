import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':nodeId/children')
  getNodeChildren(@Param('nodeId') nodeId: string) {
    return this.appService.getNodeChildren(nodeId);
  }
}
