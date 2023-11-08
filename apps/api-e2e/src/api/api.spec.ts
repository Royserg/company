import axios from 'axios';

// NOTE: requires the server to be running (`nx serve api`)

describe('GET /api/nodes/root/children', () => {
  it('should return a list with nodes', async () => {
    const res = await axios.get(`/api/nodes/root/children`);

    const expected = [
      {
        height: 1,
        id: 'b74770b1-a760-43e2-aeb9-6d389104ef6f',
        name: 'A',
        parentId: 'root',
      },
      {
        height: 1,
        id: '1966520a-66b3-44eb-a1ba-b71bd642bab8',
        name: 'B',
        parentId: 'root',
      },
    ];

    expect(res.status).toBe(200);
    expect(res.data).toEqual(expected);
  });
});
