import { Test } from '@nestjs/testing';
import {
  mockA,
  mockB,
  mockC,
  mockD,
  mockE,
  mockMemoryDb,
  mockRoot,
} from './mocks/mock-memory-db';

jest.mock('./data/memory-db', () => ({
  memoryDb: mockMemoryDb,
}));

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeParentDto } from './dto/update-node-parent.dto';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getNodeChildren', () => {
    it('should return 2 children of root node: [A, B]', () => {
      const result = service.getNodeChildren(mockRoot.id);
      const expected = [mockA, mockB];

      expect(result).toEqual(expected);
    });

    it('should return 1 child of A node: [C]', () => {
      const result = service.getNodeChildren(mockA.id);
      const expected = [mockC];

      expect(result).toEqual(expected);
    });

    it('should return 2 children of C node: [D, E]', () => {
      const result = service.getNodeChildren(mockC.id);
      const expected = [mockD, mockE];

      expect(result).toEqual(expected);
    });

    it('should return 0 children of D node: []', () => {
      const result = service.getNodeChildren(mockD.id);
      const expected = [];

      expect(result).toEqual(expected);
    });

    it('should return 0 children of E node: []', () => {
      const result = service.getNodeChildren(mockE.id);
      const expected = [];

      expect(result).toEqual(expected);
    });
  });

  describe('createNode', () => {
    it('should throw NotFoundException if parent node not found', () => {
      const createNodeDto: CreateNodeDto = {
        name: 'NODE_NAME',
        parentId: 'NON_EXISTING_PARENT_ID',
      };

      let hasThrown = false;

      try {
        service.createNode(createNodeDto);
      } catch (error) {
        hasThrown = true;
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect((error as HttpException).getResponse()).toEqual({
          error: 'Not Found',
          message: 'Parent node not found',
          statusCode: 404,
        });
      }

      expect(hasThrown).toBe(true);
    });

    it('should return newly created Node', () => {
      const createNodeDto: CreateNodeDto = {
        name: 'NODE_NAME',
        parentId: mockE.id,
      };

      const result = service.createNode(createNodeDto);

      expect(result).toEqual({
        id: expect.any(String),
        name: createNodeDto.name,
        parentId: mockE.id,
        height: mockE.height + 1,
      });
    });
  });

  describe('recalculateChildrenHeight', () => {
    it('changing C height(2) to 1 should change D and E height to 2', () => {
      mockC.height = 1;
      service.recalculateChildrenHeight(mockC);

      expect(mockC.height).toBe(1);
      expect(mockD.height).toBe(2);
      expect(mockE.height).toBe(2);
      mockC.height = 2;
    });
  });

  describe('updateNodeParent', () => {
    it('should throw NotFoundException if targetNode is not found', () => {
      const nodeId = 'NON_EXISTING_NODE_ID';
      const updateNodeParentDto: UpdateNodeParentDto = {
        newParentId: 'PARENT_ID',
      };

      let hasThrown = false;

      try {
        service.updateNodeParent(nodeId, updateNodeParentDto);
      } catch (error) {
        hasThrown = true;
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect((error as HttpException).getResponse()).toEqual({
          error: 'Not Found',
          message: 'Node not found',
          statusCode: 404,
        });
      }

      expect(hasThrown).toBe(true);
    });

    it('should throw NotFoundException if parent node not found', () => {
      const nodeId = mockA.id;
      const updateNodeParentDto: UpdateNodeParentDto = {
        newParentId: 'NON_EXISTING_PARENT_ID',
      };

      let hasThrown = false;

      try {
        service.updateNodeParent(nodeId, updateNodeParentDto);
      } catch (error) {
        hasThrown = true;
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect((error as HttpException).getResponse()).toEqual({
          error: 'Not Found',
          message: 'New parent node not found',
          statusCode: 404,
        });
      }

      expect(hasThrown).toBe(true);
    });

    it('should throw BadRequestException when new node parent id points to node id', () => {
      const nodeId = mockA.id;
      const updateNodeParentDto: UpdateNodeParentDto = {
        newParentId: mockA.id,
      };

      let hasThrown = false;

      try {
        service.updateNodeParent(nodeId, updateNodeParentDto);
      } catch (error) {
        hasThrown = true;
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as HttpException).getStatus()).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect((error as HttpException).getResponse()).toEqual({
          error: 'Bad Request',
          message: 'Node cannot be its own parent',
          statusCode: 400,
        });
      }

      expect(hasThrown).toBe(true);
    });

    it('should throw BadRequestException when new node parent is a child of target node', () => {
      const nodeId = mockRoot.id;
      const updateNodeParentDto: UpdateNodeParentDto = {
        newParentId: mockC.id,
      };

      let hasThrown = false;

      try {
        service.updateNodeParent(nodeId, updateNodeParentDto);
      } catch (error) {
        hasThrown = true;
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as HttpException).getStatus()).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect((error as HttpException).getResponse()).toEqual({
          error: 'Bad Request',
          message: 'Node cannot be a child of its own child',
          statusCode: 400,
        });
      }

      expect(hasThrown).toBe(true);
    });

    it(`should change node's parent and update height of its children`, () => {
      const nodeId = mockC.id;
      const updateNodeParentDto: UpdateNodeParentDto = {
        newParentId: mockB.id,
      };

      jest.spyOn(service, 'recalculateChildrenHeight');

      const result = service.updateNodeParent(nodeId, updateNodeParentDto);

      const expected = {
        id: mockC.id,
        name: mockC.name,
        parentId: mockB.id,
        height: mockB.height + 1,
      };

      expect(result).toEqual(expected);
      expect(service.recalculateChildrenHeight).toHaveBeenCalled();
    });
  });

  describe('isChildOfNode', () => {
    it('should return true if node is a direct child of target node', () => {
      const result = service.isChildOfNode(mockA.id, mockRoot.id);
      expect(result).toBe(true);
    });

    it('should return true if node is a child of target node (few levels down)', () => {
      const result = service.isChildOfNode(mockD.id, mockRoot.id);
      expect(result).toBe(true);
    });

    it('should return false if child node and parent node have the same id', () => {
      const result = service.isChildOfNode(mockA.id, mockA.id);
      expect(result).toBe(false);
    });

    it('should return false if node is not a child of target node', () => {
      const result = service.isChildOfNode(mockRoot.id, mockC.id);
      expect(result).toBe(false);
    });
  });
});
