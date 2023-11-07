import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { memoryDb } from './data/memory-db';
import { CreateNodeDto } from './dto/create-node.dto';
import { Node } from './interfaces/node';

@Injectable()
export class AppService {
  createNode(createNodeDto: CreateNodeDto): Node {
    const parentNode = memoryDb.find(
      (node) => node.id === createNodeDto.parentId,
    );
    if (!parentNode) {
      throw new NotFoundException('Parent node not found');
    }

    // New node is attached to the parent -> one level below
    const height = parentNode.height + 1;
    const id = uuidv4();

    const newNode: Node = {
      id,
      height,
      ...createNodeDto,
    };

    memoryDb.push(newNode);
    return newNode;
  }

  getNodeChildren(nodeId: string): Node[] {
    const nodes = memoryDb.filter((node) => node.parentId === nodeId);
    return nodes;
  }
}
