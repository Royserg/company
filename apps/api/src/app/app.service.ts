import { Injectable } from '@nestjs/common';
import { memoryDb } from './data/memory-db';
import { Node } from './interfaces/node';

@Injectable()
export class AppService {
  getNodeChildren(nodeId: string): Node[] {
    const nodes = memoryDb.filter((node) => node.parentId === nodeId);
    return nodes;
  }
}
