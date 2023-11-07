import { Node } from '../interfaces/node';

const CEO: Node = {
  id: 'root',
  name: 'CEO',
  parentId: null,
  height: 0,
};
const A: Node = {
  id: 'b74770b1-a760-43e2-aeb9-6d389104ef6f',
  name: 'A',
  parentId: CEO.id,
  height: 1,
};
const B: Node = {
  id: '1966520a-66b3-44eb-a1ba-b71bd642bab8',
  name: 'B',
  parentId: CEO.id,
  height: 1,
};
const C: Node = {
  id: '4b949b51-c42d-475e-a53c-a87cbe03894a',
  name: 'C',
  parentId: A.id,
  height: 2,
};
const D: Node = {
  id: '63319e61-9120-4108-908d-bbb1b902e551',
  name: 'D',
  parentId: C.id,
  height: 3,
};
const E: Node = {
  id: 'f1b30b6f-8878-4de9-a6fe-45c2cfb67e2f',
  name: 'E',
  parentId: C.id,
  height: 3,
};

export const memoryDb: Node[] = [CEO, A, B, C, D, E];
