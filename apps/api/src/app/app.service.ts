import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { memoryDb } from './data/memory-db';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeParentDto } from './dto/update-node-parent.dto';
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

  updateNodeParent(
    nodeId: string,
    updateNodeParentDto: UpdateNodeParentDto,
  ): Node {
    if (nodeId === updateNodeParentDto.newParentId) {
      throw new BadRequestException('Node cannot be its own parent');
    }

    const targetNodeIndex = memoryDb.findIndex((node) => node.id === nodeId);
    if (targetNodeIndex === -1) {
      throw new NotFoundException('Node not found');
    }

    const newParentNodeIndex = memoryDb.findIndex(
      (node) => node.id === updateNodeParentDto.newParentId,
    );
    if (newParentNodeIndex === -1) {
      throw new NotFoundException('New parent node not found');
    }

    const isChildOfNewParent = this.isChildOfNode(
      updateNodeParentDto.newParentId,
      nodeId,
    );
    if (isChildOfNewParent) {
      throw new BadRequestException('Node cannot be a child of its own child');
    }

    // Update parent Id of the node, and recalculate the height of the node and its children
    memoryDb[targetNodeIndex].parentId = updateNodeParentDto.newParentId;
    memoryDb[targetNodeIndex].height = memoryDb[newParentNodeIndex].height + 1;
    this.recalculateChildrenHeight(memoryDb[targetNodeIndex]);

    return memoryDb[targetNodeIndex];
  }

  // -- Helpers --
  // Update the height of all children of a node
  recalculateChildrenHeight(node: Node): void {
    const children = memoryDb.filter((child) => child.parentId === node.id);
    children.forEach((child) => {
      child.height = node.height + 1;
      this.recalculateChildrenHeight(child);
    });
  }

  // Check if a node is a child of another node
  isChildOfNode(childNodeId: string, parentNodeId: string): boolean {
    if (childNodeId === parentNodeId) {
      return false;
    }

    let currentNode = memoryDb.find((node) => node.id === childNodeId);

    // Traverse up the tree
    while (currentNode) {
      if (!currentNode) {
        return false;
      }
      if (currentNode.parentId === parentNodeId) {
        return true;
      }
      currentNode = memoryDb.find((node) => node.id === currentNode.parentId);
    }

    return false;
  }
}
