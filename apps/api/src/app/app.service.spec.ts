import { Test } from '@nestjs/testing';
import {
  mockMemoryDb,
  mockRoot,
  mockA,
  mockB,
  mockC,
  mockD,
  mockE,
} from './mocks/mock-memory-db';

jest.mock('./data/memory-db', () => ({
  memoryDb: mockMemoryDb,
}));

import { AppService } from './app.service';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateNodeDto } from './dto/create-node.dto';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
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
        parentId: mockRoot.id,
      };

      const result = service.createNode(createNodeDto);

      expect(result).toEqual({
        id: expect.any(String),
        name: createNodeDto.name,
        parentId: mockRoot.id,
        height: mockRoot.height + 1,
      });
    });
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
});
