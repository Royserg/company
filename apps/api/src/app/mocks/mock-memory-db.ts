import { Node } from '../interfaces/node';

export const mockRoot: Node = {
  id: 'root',
  name: 'Node0',
  height: 0,
  parentId: null,
};
export const mockA: Node = {
  id: 'NODE_A_ID',
  name: 'NodeA',
  parentId: mockRoot.id,
  height: 1,
};
export const mockB: Node = {
  id: 'NODE_B_ID',
  name: 'NodeB',
  parentId: mockRoot.id,
  height: 1,
};
export const mockC: Node = {
  id: 'NODE_C_ID',
  name: 'NodeC',
  parentId: mockA.id,
  height: 2,
};
export const mockD: Node = {
  id: 'NODE_D_ID',
  name: 'NodeD',
  parentId: mockC.id,
  height: 3,
};
export const mockE: Node = {
  id: 'NODE_E_ID',
  name: 'NodeE',
  parentId: mockC.id,
  height: 3,
};

export const mockMemoryDb: Node[] = [
  mockRoot,
  mockA,
  mockB,
  mockC,
  mockD,
  mockE,
];
