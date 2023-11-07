import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { Node } from './interfaces/node';
import { UpdateNodeParentDto } from './dto/update-node-parent.dto';

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

  @Put(':nodeId/parent')
  updateNodeParent(
    @Param('nodeId') nodeId: string,
    @Body() updateNodeParentDto: UpdateNodeParentDto,
  ): Node {
    return this.appService.updateNodeParent(nodeId, updateNodeParentDto);
  }
}
