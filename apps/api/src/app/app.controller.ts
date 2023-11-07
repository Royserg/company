import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { Node } from './interfaces/node';

@Controller('nodes')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createNode(@Body() createNodeDto: CreateNodeDto): Node {
    return this.appService.createNode(createNodeDto);
  }

  @Get(':nodeId/children')
  getNodeChildren(@Param('nodeId') nodeId: string): Node[] {
    return this.appService.getNodeChildren(nodeId);
  }
}
