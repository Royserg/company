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
});
