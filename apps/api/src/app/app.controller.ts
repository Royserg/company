import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateNodeDto } from './dto/create-node.dto';

@Controller('nodes')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createNode(@Body() createNodeDto: CreateNodeDto) {
    return this.appService.createNode(createNodeDto);
  }

  @Get(':nodeId/children')
  getNodeChildren(@Param('nodeId') nodeId: string) {
    return this.appService.getNodeChildren(nodeId);
  }
}
